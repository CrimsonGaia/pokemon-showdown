(function ($) {
	var BattleRoom = this.BattleRoom = ConsoleRoom.extend({
		type: 'battle',
		title: '',
		minWidth: 320,
		minMainWidth: 956,
		maxWidth: 1180,
		initialize: function (data) {
			this.choice = undefined;
			/** are move/switch/team-preview controls currently being shown? */
			this.controlsShown = false;
			this.terastallizeArmedIndex = null;
			this.teraEmpowerArmedIndex = null;
			this.canTeraEmpower = false;
			this.megaEvoArmedIndex = null;
			this.megaEvoArmedLetter = null;
			this.canMegaEvoLetter = null;
			this.battlePaused = false;
			this.autoTimerActivated = false;
			this.mySeat = 'p1';
			this.dualSeat = false;
			this.companionRoom = null;
			this.isCompanionSeat = false;
			this.rawLog = [];
			this.isSideRoom = Dex.prefs('rightpanelbattles');
			this.$el.addClass('ps-room-opaque').html('<div class="battle">Battle is here</div><div class="foehint"></div><div class="battle-log" aria-label="Battle Log" role="complementary"></div><div class="battle-log-add">Connecting...</div><ul class="battle-userlist userlist userlist-minimized"></ul><div class="battle-controls" role="complementary" aria-label="Battle Controls"></div><button class="battle-chat-toggle button" name="showChat"><i class="fa fa-caret-left"></i> Chat</button>');
			this.$battle = this.$el.find('.battle');
			this.$controls = this.$el.find('.battle-controls');
			this.$chatFrame = this.$el.find('.battle-log');
			this.$chatAdd = this.$el.find('.battle-log-add');
			this.$foeHint = this.$el.find('.foehint');
			BattleSound.setMute(Dex.prefs('mute'));
			this.battle = new Battle({
				id: this.id,
				$frame: this.$battle,
				$logFrame: this.$chatFrame
			});
			this.battle.roomid = this.id;
			this.battle.joinButtons = true;
			this.tooltips = this.battle.scene.tooltips;
			this.tooltips.listen(this.$controls);
			var self = this;
			this.battle.subscribe(function () {
				self.updateControls();
				// IMPORTANT: don't rely on the callback argument being "atQueueEnd".
				// The reliable signal is battle.atQueueEnd.
			});
			this.users = {};
			this.userCount = { users: 0 };
			this.$userList = this.$('.userlist');
			this.userList = new UserList({
				el: this.$userList,
				room: this
			});
			this.userList.construct();
			this.$chat = this.$chatFrame.find('.inner');
			this.$options = this.battle.scene.$options.html('<div style="padding-top: 3px; padding-right: 3px; text-align: right"><button class="icon button" name="openBattleOptions" title="Options">Battle Options</button></div>');
		},
		events: {
			'click .replayDownloadButton': 'clickReplayDownloadButton',
			'click .terachargebutton': 'toggleTeraCharge',
			'click .megachargebutton': 'toggleMegaEvo',
			'click .guardbutton': 'chooseGuard',
			'mouseenter .terachargebutton': 'teraChargeHoverOn',
			'mouseleave .terachargebutton': 'teraChargeHoverOff',
		},
		battleEnded: false,
		send: function (data) { app.send(data, this.isCompanionSeat ? this.battleRoomId : this.id); },
		join: function () {
			if (this.isCompanionSeat) return;
			app.send('/join ' + this.id);
		},
		showChat: function () {
			this.$('.battle-chat-toggle').attr('name', 'hideChat').html('Battle <i class="fa fa-caret-right"></i>');
			this.$el.addClass('showing-chat');
		},
		hideChat: function () {
			this.$('.battle-chat-toggle').attr('name', 'showChat').html('<i class="fa fa-caret-left"></i> Chat');
			this.$el.removeClass('showing-chat');
		},
		leave: function () {
			if (this.isCompanionSeat) {
				if (this.battle) this.battle.destroy();
				return;
			}
			if (!this.expired) app.send('/noreply /leave ' + this.id);
			if (this.battle) this.battle.destroy();
			if (this.companionRoom) { app.removeRoom(this.companionRoom.id); this.companionRoom = null; }
		},
		requestLeave: function (e) {
			if (this.isCompanionSeat) return true;
			if ((this.side || this.requireForfeit) && this.battle && !this.battleEnded && !this.expired && !this.battle.forfeitPending) {
				app.addPopup(ForfeitPopup, { room: this, sourceEl: e && e.currentTarget, gameType: 'battle' });
				return false;
			}
			return true;
		},
		updateLayout: function () {
			var width = this.$el.width();
			if (width < 950 || this.battle.hardcoreMode) { this.battle.messageShownTime = 500; } 
			else { this.battle.messageShownTime = 1; }
			if (width && width < 640) {
				var scale = (width / 640);
				this.$battle.css('transform', 'scale(' + scale + ')');
				this.$foeHint.css('transform', 'scale(' + scale + ')');
			} else {
				this.$battle.css('transform', 'none');
				this.$foeHint.css('transform', 'none');
			}
			this.$el.toggleClass('small-layout', width < 830);
			this.$el.toggleClass('tiny-layout', width < 640);
			if (this.$chat) this.$chatFrame.scrollTop(this.$chat.height());
		},
		show: function () {
			Room.prototype.show.apply(this, arguments);
			this.updateLayout();
		},
		receive: function (data) {
			var hadCompanion = !!this.companionRoom;
			this.rawLog.push(data);
			this.add(data);
			if (hadCompanion && this.companionRoom) this.companionRoom.add(data);
		},
		focus: function (e) {
			this.tooltips.hideTooltip();
			if (this.battle.paused && !this.battlePaused) {
				if (Dex.prefs('noanim')) this.battle.seekTurn(Infinity);
				this.battle.play();
			}
			ConsoleRoom.prototype.focus.call(this, e);
		},
		blur: function () { this.battle.pause(); },
		init: function (data) {
			var log = data.split('\n');
			if (data.substr(0, 6) === '|init|') log.shift();
			// If battle isn't constructed yet for some reason, do it before we touch it.
			// (Depending on your client flow this might be unnecessary, but it's safe.)
			if (!this.battle) {
				// If your codebase guarantees this.battle exists here, you can remove this guard.
				this.battle = this.battle || {};
				this.battle.stepQueue = this.battle.stepQueue || [];
			}
			if (log.length && log[0].substr(0, 7) === '|title|') {
				this.title = log[0].substr(7);
				log.shift();
				app.roomTitleChanged(this);
			}
			if (this.battle.stepQueue && this.battle.stepQueue.length) return;
			this.battle.stepQueue = log;
			this.battle.seekTurn(Infinity, true);
			if (this.battle.ended) this.battleEnded = true;
			this.updateLayout();
			this.updateControls();
		},
		add: function (data) {
			if (!data) return;
			// init packet
			if (data.substr(0, 6) === '|init|') return this.init(data);
			// leave gatekeeping
			if (data.substr(0, 11) === '|cantleave|') {
				this.requireForfeit = true;
				return;
			}
			if (data.substr(0, 12) === '|allowleave|') {
				this.requireForfeit = false;
				return;
			}
			// fast-path: server can send request as a standalone packet
			if (data.substr(0, 9) === '|request|') {
				var reqBlock = data.slice(9);
				var requestData = null;
				var choiceText = null;
				var nlIndex = reqBlock.indexOf('\n');
				if (/[0-9]/.test(reqBlock.charAt(0)) && reqBlock.charAt(1) === '|') {
					// backwards compat
					choiceText = '?';
					reqBlock = reqBlock.slice(2, nlIndex);
				} else if (nlIndex >= 0) {
					// optional next line: |sentchoice|...
					if (reqBlock.slice(nlIndex + 1, nlIndex + 13) === '|sentchoice|') {
						choiceText = reqBlock.slice(nlIndex + 13);
					}
					reqBlock = reqBlock.slice(0, nlIndex);
				}
				try { requestData = JSON.parse(reqBlock); } catch (e) {}
				return this.receiveRequest(requestData, choiceText);
			}
			var log = data.split('\n');
			for (var i = 0; i < log.length; i++) {
				var logLine = log[i];
				// streamed request inside mixed packets
				if (logLine.substr(0, 9) === '|request|') {
					var reqText = logLine.slice(9);
					var choiceText2 = null;
					// optional next line: |sentchoice|...
					if (i + 1 < log.length && log[i + 1].substr(0, 12) === '|sentchoice|') {
						choiceText2 = log[i + 1].slice(12);
						i++; // consume it
					}
					var requestData2 = null;
					try { requestData2 = JSON.parse(reqText); } catch (e2) {}
					this.receiveRequest(requestData2, choiceText2);
					continue; // CRITICAL: don't process this line further
				}
				if (logLine === '|') {
					this.callbackWaiting = false;
					this.controlsShown = false;
					this.$controls.html('');
					continue;
				}
				if (logLine.substr(0, 10) === '|callback|') {
					var args = logLine.substr(10).split('|');
					var pokemon = isNaN(Number(args[1])) ? this.battle.getPokemon(args[1]) : this.battle.nearSide.active[args[1]];
					var requestData3 = this.request && this.request.active ? this.request.active[pokemon ? pokemon.slot : 0] : null;
					this.choice = undefined;
					switch (args[0]) {
						case 'trapped': {
							if (requestData3) requestData3.trapped = true;
							var pokeName = pokemon.side.n === 0 ?
								BattleLog.escapeHTML(pokemon.name) :
								"The opposing " + (this.battle.ignoreOpponent || this.battle.ignoreNicks ? pokemon.speciesForme : BattleLog.escapeHTML(pokemon.name));
							this.battle.stepQueue.push('|message|' + pokeName + ' is trapped and cannot switch!');
							break;
						}
						case 'cant': { // IMPORTANT: do NOT reuse outer loop variable `i`
							if (requestData3 && requestData3.moves) { for (var j = 0; j < requestData3.moves.length; j++) { if (requestData3.moves[j].id === args[3]) requestData3.moves[j].disabled = true; } }
							args.splice(1, 1, pokemon.getIdent());
							this.battle.stepQueue.push('|' + args.join('|'));
							break;
						}
					}
				continue;
				}
				if (logLine.substr(0, 7) === '|title|') continue;
				if (logLine.substr(0, 5) === '|win|' || logLine === '|tie') {
					this.battleEnded = true;
					this.battle.stepQueue.push(logLine);
					continue;
				}
				if (
					logLine.substr(0, 6) === '|chat|' ||
					logLine.substr(0, 3) === '|c|' ||
					logLine.substr(0, 4) === '|c:|' ||
					logLine.substr(0, 9) === '|chatmsg|' ||
					logLine.substr(0, 10) === '|inactive|'
				) {
					this.battle.instantAdd(logLine);
					continue;
				}
				this.battle.stepQueue.push(logLine);
			}
			this.battle.add();
			if (Dex.prefs('noanim')) this.battle.seekTurn(Infinity);
			this.updateControls();
		},
		toggleMessages: function (user) {
			var $messages = $('.chatmessage-' + user + '.revealed');
			var $button = $messages.find('button');
			if (!$messages.is(':hidden')) {
				$messages.hide();
				$button.html('<small>(' + ($messages.length) + ' line' + ($messages.length > 1 ? 's' : '') + 'from ' + user + ')</small>');
				$button.parent().show();
			} else {
				$button.html('<small>(Hide ' + ($messages.length) + ' line' + ($messages.length > 1 ? 's' : '') + ' from ' + user + ')</small>');
				$button.parent().removeClass('revealed');
				$messages.show();
			}
		},
		setHardcoreMode: function (mode) {
			this.battle.setHardcoreMode(mode);
			var id = '#' + this.el.id + ' ';
			this.$('.hcmode-style').remove();
			this.updateLayout(); // set animation delay
			if (mode) this.$el.prepend('<style class="hcmode-style">' + id + '.battle .turn,' + id + '.battle-history{display:none !important;}</style>');
			if (this.choice && this.choice.waiting) {
				this.updateControlsForPlayer();
			}
		},
		//region Battle stuff
		updateControls: function () {
			if (this.battle.scene.customControls) return;
			var controlsShown = this.controlsShown;
			var switchViewpointButton = '<p><button class="button" name="switchViewpoint"><i class="fa fa-random"></i> Switch viewpoint</button></p>';
			this.controlsShown = false;
			if (this.battle.seeking !== null) {
				// battle is seeking
				this.$controls.html('');
				return;
			} else if (!this.battle.atQueueEnd) {
				// battle is playing or paused
				if (!this.side || this.battleEnded) {
					// spectator
					if (this.battle.paused) {
						// paused
						this.$controls.html(
							'<p><button class="button" style="min-width:4.5em;margin-right:3px" name="resume"><i class="fa fa-play"></i><br />Play</button> ' +
							'<button class="button button-first" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button button-first" style="margin-left:1px" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Prev turn</button><button class="button button-last" style="margin-right:2px" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button><button class="button button-last" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button></p>' +
							switchViewpointButton
						);
					} else {
						// playing
						this.$controls.html(
							'<p><button class="button" style="min-width:4.5em;margin-right:3px" name="pause"><i class="fa fa-pause"></i><br />Pause</button> ' +
							'<button class="button button-first" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button button-first" style="margin-left:1px" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Prev turn</button><button class="button button-last" style="margin-right:2px" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button><button class="button button-last" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button></p>' +
							switchViewpointButton
						);
					}
				} else {
					this.$controls.html(
					'<p class="whatdo">' +
						this.getWhatDoHTML('', '', true,
							'<button class="button" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button> ' +
							'<button class="button" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button>'
						) +
					'</p>'
					);
				}
				return;
			}
			if (this.battle.ended) {
				var replayDownloadButton = '<span style="float:right;"><a href="//' + Config.routes.replays + '/download" class="button replayDownloadButton"><i class="fa fa-download"></i> Download replay</a><br /><br /><button class="button" name="saveReplay"><i class="fa fa-upload"></i> Upload and share replay</button></span>';
				// battle has ended
				if (this.side) {
					// was a player
					this.closeNotification('choice');
					this.$controls.html('<div class="controls"><p>' + replayDownloadButton + '<button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />Instant replay</button></p><p><button class="button" name="closeAndMainMenu"><strong>Main menu</strong><br /><small>(closes this battle)</small></button> <button class="button" name="closeAndRematch"><strong>Rematch</strong><br /><small>(closes this battle)</small></button></p></div>');
				} else { this.$controls.html('<div class="controls"><p>' + replayDownloadButton + '<button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />Instant replay</button></p>' + switchViewpointButton + '</div>'); }
			} else if (this.side) {
				// player
				this.controlsShown = true;
				if (!controlsShown || this.choice === undefined || this.choice && this.choice.waiting) {
					// don't update controls (and, therefore, side) if `this.choice === null`: causes damage miscalculations
					this.updateControlsForPlayer();
				} else { this.updateTimer(); }
			} else if (!this.battle.nearSide.name || !this.battle.farSide.name) {
				// empty battle
				this.$controls.html('<p><em>Waiting for players...</em></p>');
			} else {
				// full battle
				if (this.battle.paused) {
					// paused
					this.$controls.html(
						'<p><button class="button" style="min-width:4.5em;margin-right:3px" name="resume"><i class="fa fa-play"></i><br />Play</button> ' +
						'<button class="button button-first" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button button-first" style="margin-left:1px" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Prev turn</button><button class="button button-last disabled" style="margin-right:2px" disabled><i class="fa fa-step-forward"></i><br />Skip turn</button><button class="button button-last disabled" disabled><i class="fa fa-fast-forward"></i><br />Skip to end</button></p>' +
						switchViewpointButton + '<p><em>Waiting for players...</em></p>'
					);
				} else {
					// playing
					this.$controls.html(
						'<p><button class="button" style="min-width:4.5em;margin-right:3px" name="pause"><i class="fa fa-pause"></i><br />Pause</button> ' +
						'<button class="button button-first" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button button-first" style="margin-left:1px" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Prev turn</button><button class="button button-last disabled" style="margin-right:2px" disabled><i class="fa fa-step-forward"></i><br />Skip turn</button><button class="button button-last disabled" disabled><i class="fa fa-fast-forward"></i><br />Skip to end</button></p>' +
						switchViewpointButton + '<p><em>Waiting for players...</em></p>'
					);
				}
			}
			// This intentionally doesn't happen if the battle is still playing, since those early-return.
			app.topbar.updateTabbar();
			this.updateTeraCharge();
			this.updateMegaCharge();
		},
		updateControlsForPlayer: function () {
			this.callbackWaiting = true;
			var act = '';
			var switchables = [];
			if (this.request) {
				this.updateSide();
				if (this.request.ally) this.addAlly(this.request.ally);
				act = this.request.requestType;
				if (this.request.side) switchables = this.battle.myPokemon;
				if (!this.finalDecision) this.finalDecision = !!this.request.noCancel;
			}
			if (this.choice && this.choice.waiting) { act = ''; }
			var type = this.choice ? this.choice.type : '';
			this.canTerastallize = null;
			switch (act) {
			case 'move':
				if (!this.choice) {
					this.choice = {
						choices: [],
						switchFlags: {},
						switchOutFlags: {}
					};
				}
				this.updateMoveControls(type);
				break;
			case 'switch':
				if (!this.choice) {
					this.choice = {
						choices: [],
						switchFlags: {},
						switchOutFlags: {},
						freedomDegrees: 0,
						canSwitch: 0
					};
					if (this.request.forceSwitch !== true) {
						var faintedLength = _.filter(this.request.forceSwitch, function (fainted) { return fainted; }).length;
						var freedomDegrees = faintedLength - _.filter(
							switchables.slice(this.battle.pokemonControlled),
							function (mon) { return !mon.fainted; }
						).length;
						this.choice.freedomDegrees = Math.max(freedomDegrees, 0);
						this.choice.canSwitch = faintedLength - this.choice.freedomDegrees;
					}
				}
				this.updateSwitchControls(type);
				break;
			case 'team':
				if (this.battle.mySide.pokemon && !this.battle.mySide.pokemon.length) {
					this.controlsShown = false;
					return;
				}
				if (!this.choice) {
					this.choice = {
						choices: null,
						teamPreview: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].slice(0, switchables.length),
						done: 0,
						count: 1
					};
					if (this.battle.gameType === 'multi') this.choice.count = 1;
					if (this.battle.gameType === 'doubles') this.choice.count = 2;
					if (this.battle.gameType === 'triples' || this.battle.gameType === 'rotation') this.choice.count = 3;
					for (var i = 0; i < switchables.length && i < 6; i++) { if (toID(switchables[i].baseAbility) === 'illusion') this.choice.count = this.battle.myPokemon.length; }
					if (this.battle.teamPreviewCount) {
						var requestCount = parseInt(this.battle.teamPreviewCount, 10);
						if (requestCount > 0 && requestCount <= switchables.length) this.choice.count = requestCount;
					}
					this.choice.choices = new Array(this.choice.count);
				}
				this.updateTeamControls(type);
				break;
			default:
				this.updateWaitControls();
				break;
			}
		},
		timerInterval: 0,
		getTimerHTML: function (nextTick) {
			var time = 'Timer';
			var timerTicking = (this.battle.kickingInactive && this.request && !this.request.wait && !(this.choice && this.choice.waiting)) ? ' timerbutton-on' : '';
			if (!nextTick) {
				var self = this;
				if (this.timerInterval) {
					clearInterval(this.timerInterval);
					this.timerInterval = 0;
				}
				if (timerTicking) this.timerInterval = setInterval(function () {
					var $timerButton = self.$('.timerbutton');
					if ($timerButton.length) { $timerButton.replaceWith(self.getTimerHTML(true)); } 
					else {
						clearInterval(self.timerInterval);
						self.timerInterval = 0;
					}
				}, 1000);
			} else if (this.battle.kickingInactive > 1) {
				this.battle.kickingInactive--;
				if (this.battle.graceTimeLeft) this.battle.graceTimeLeft--;
				else if (this.battle.totalTimeLeft) this.battle.totalTimeLeft--;
			}
			if (this.battle.kickingInactive) {
				var secondsLeft = this.battle.kickingInactive;
				if (secondsLeft !== true) {
					if (secondsLeft <= 10 && timerTicking) { timerTicking = ' timerbutton-critical'; }
					var minutesLeft = Math.floor(secondsLeft / 60);
					secondsLeft -= minutesLeft * 60;
					time = '' + minutesLeft + ':' + (secondsLeft < 10 ? '0' : '') + secondsLeft;
					secondsLeft = this.battle.totalTimeLeft;
					if (secondsLeft) {
						minutesLeft = Math.floor(secondsLeft / 60);
						secondsLeft -= minutesLeft * 60;
						time += ' | ' + minutesLeft + ':' + (secondsLeft < 10 ? '0' : '') + secondsLeft + ' total';
					}
				} else { time = '-:--'; }
			}
			return '<button name="openTimer" class="button timerbutton' + timerTicking + '"><i class="fa fa-hourglass-start"></i> ' + time + '</button>';
		},
		//region Tera Charge
		getMyTeraChargeState: function () {
			// SOURCE OF TRUTH: private request JSON from server
			if (this.request && this.request.side && this.request.side.teraCharge != null) {
				return {
					cur: Number(this.request.side.teraCharge) || 0,
					max: Number(this.request.side.teraChargeMax) || 100
				};
			}
			return null;
		},
		getTeraChargeDisplay: function (rawCur, rawMax) {
			if (!Number.isFinite(rawCur)) rawCur = 0;
			if (!Number.isFinite(rawMax) || rawMax <= 0) rawMax = 10;
			var cur = Math.round(rawCur / rawMax * 100);
			if (cur < 0) cur = 0;
			if (cur > 100) cur = 100;
			return {cur: cur, max: 100, pct: cur};
		},
		getTeraChargeHTML: function () {
			var st = this.getMyTeraChargeState();
			if (!st) return ''; // no button until we know
			var rawCur = st.cur;
			var rawMax = st.max;
			// Display values (always out of 100)
			var d = this.getTeraChargeDisplay(rawCur, rawMax);
			var mySide = this.battle && this.battle.mySide;
			var alreadyTera = !!(mySide && mySide.pokemon && mySide.pokemon.some(function (p) { return !!p.terastallized; }));
			var tooltipArgs = 'teracharge|' + rawCur + '|' + rawMax + (alreadyTera ? '|1' : '');
			return '' +
				'<button class="button terachargebutton has-tooltip" type="button" name="teracharge" ' +
				'data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '" ' +
				'aria-label="Tera Charge: ' + d.cur + '/' + d.max + '" ' +
				'style="position:relative;overflow:hidden;">' +
					// FULL-BUTTON fill layer
					'<span class="teracharge-fill" style="' +
						'position:absolute;left:0;top:0;bottom:0;width:' + d.pct + '%;' +
						'display:block;pointer-events:none;z-index:0;"></span>' +
					// red spend-preview overlay (positioned by updateTeraCharge)
					'<span class="teracharge-spend" style="' +
						'position:absolute;top:0;bottom:0;right:0;width:0;' +
						'background:rgba(255,0,0,0.65);display:none;pointer-events:none;z-index:1;"></span>' +
					// Foreground content
					'<span class="teracharge-left" style="position:relative;z-index:2;float:left;margin-right:-40px">' + d.cur + '</span>' +
					'<span class="teracharge-text" style="position:relative;z-index:2;display:block;text-align:right; padding-right: 4px;">Tera</span>' +
					'<span class="teracharge-typeicon" style="position:absolute;z-index:2;right:6px;top:50%;transform:translateY(-50%);display:none">' +
					'<img class="teracharge-typeicon-img" alt="" style="height:25px;width:25px;margin-top:9px;" />' +
					'</span>' +
				'</button>';
		},
		//region Mega Charge
		getMyMegaChargeState: function () { // attaches side.megaCharge/megaChargeMax onto every outgoing move request)
			if (this.request && this.request.side && this.request.side.megaCharge != null) {
				return {
					cur: Number(this.request.side.megaCharge) || 0,
					max: Number(this.request.side.megaChargeMax) || 100
				};
			}
			return null;
		},
		getMegaChargeHTML: function () {
			var st = this.getMyMegaChargeState();
			if (!st) return '';
			var letter = this.canMegaEvoLetter;
			var cur = Math.max(0, Math.min(100, Math.round(st.cur / (st.max || 100) * 100)));
			var tooltipArgs = 'megacharge|' + st.cur + '|' + st.max;
			return '' +
				'<button class="button megachargebutton has-tooltip" type="button" name="megacharge" ' +
				'data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '" ' +
				'aria-label="Mega Charge: ' + st.cur + '/' + st.max + '" ' +
				'style="position:relative;overflow:hidden;">' +
					'<span class="megacharge-fill" style="' +
						'position:absolute;left:0;top:0;bottom:0;width:' + cur + '%;' +
						'background-color:rgb(247 85 197 / 30%);display:block;pointer-events:none;z-index:0;' +
						'transition:width 0.4s ease-out;"></span>' +
					'<span class="megacharge-left" style="' +
						'position:relative;z-index:2;float:left;margin-right:-40px;">' +
						(cur >= 100 && letter ? letter : st.cur) +
					'</span>' +
					'<span class="megacharge-text" style="' +
						'position:relative;z-index:2;display:block;text-align:right;padding-right:4px;">Mega</span>' +
				'</button>';
		},
		updateMegaCharge: function () {
			var st = this.getMyMegaChargeState();
			var letter = this.canMegaEvoLetter;
			var $btn = this.$controls.find('.megachargebutton');
			if (!$btn.length) return;
			if (!st || !letter) { this.megaEvoArmedIndex = null; return; }
			var cur = Math.max(0, Math.min(100, Math.round(st.cur / (st.max || 100) * 100)));
			var isFull = cur >= 100;
			if (!isFull) this.megaEvoArmedIndex = null; // can't stay armed if charge dropped below full
			$btn.toggleClass('megacharge-armed', this.megaEvoArmedIndex === this.getCurrentChoiceIndex());
			$btn.attr('aria-label', 'Mega Charge: ' + st.cur + '/' + st.max + (isFull ? ' (click to Mega Evolve)' : ''));
			$btn.attr('data-tooltip', 'megacharge|' + st.cur + '|' + st.max);
		},
		getCurrentChoiceIndex: function () {
			return (this.choice && this.choice.choices) ? this.choice.choices.length : 0;
		},
		toggleMegaEvo: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			if (!this.request || !this.request.active || !this.choice || !this.choice.choices) return;
			var st = this.getMyMegaChargeState();
			var letter = this.canMegaEvoLetter;
			if (!st || !letter) return;
			if (!(st.cur >= st.max)) return; // bar must be full to arm
			var choiceIndex = this.choice.choices.length;
			if (this.megaEvoArmedIndex === choiceIndex) {
				this.megaEvoArmedIndex = null;
				this.megaEvoArmedLetter = null;
			} else {
				this.megaEvoArmedIndex = choiceIndex;
				this.megaEvoArmedLetter = letter;
			}
			this.updateMegaCharge();
		},
		getWhatDoHTML: function (requestTitle, guardHTML, includeMega, extraLeftHTML) {
			var title = (requestTitle || '') + (extraLeftHTML || '');
			var right = '';
			if (includeMega !== false) right += this.getMegaChargeHTML();
			right += this.getTeraChargeHTML();
			right += this.getTimerHTML();
			return '' +
				'<span class="whatdo-left">' + '<span class="whatdo-title">' + title + '</span>' + '</span>' +
				'<span class="whatdo-right">' + '<span class="whatdo-guard">' + (guardHTML || '') + '</span>' + right + '</span>';
		},
		getDualTypeStyle: function (type1, type2) {
			var typeHS = {
				Normal: [60, 14], Fighting: [3, 40], Flying: [255, 20], Poison: [300, 30],
				Ground: [44, 27], Rock: [49, 35], Bug: [66, 42], Ghost: [262, 21],
				Steel: [240, 6], Fire: [25, 40], Water: [222, 29], Grass: [100, 30],
				Electric: [48, 41], Psychic: [342, 33], Ice: [180, 15], Dragon: [257, 39],
				Dark: [24, 18], Fairy: [310, 41], Banal: [66, 42], Stellar: [244, 40]
			};
			var textOverride = { Stellar: 'hsl(244,24%,24%)', Banal: 'hsl(27,42%,41%)' };
			function bg(t) { var hs = typeHS[t] || [0, 0]; return 'hsl(' + hs[0] + ',' + hs[1] + '%,93%)'; }
			function text(t) { var hs = typeHS[t] || [0, 0]; return textOverride[t] || ('hsl(' + hs[0] + ',' + hs[1] + '%,41%)'); }
			var bgGrad = 'linear-gradient(to top right, ' + bg(type1) + ' 50%, ' + bg(type2) + ' 50%)';
			var textGrad = 'linear-gradient(to top right, ' + text(type1) + ' 50%, ' + text(type2) + ' 50%)';
			return {
				buttonStyle: 'background:' + bgGrad + ';',
				textStyle: 'background-image:' + textGrad + ';-webkit-background-clip:text;background-clip:text;' + '-webkit-text-fill-color:transparent;color:transparent;'
			};
		},
		getGuardActionColorStyle: function (guardType) {
			var typeColor = {
				Normal:'#A8A878', Fire:'#F08030', Water:'#6890F0', Electric:'#F8D030', Grass:'#78C850',
				Ice:'#98D8D8', Fighting:'#C03028', Poison:'#A040A0', Ground:'#E0C068',
				Flying:'#A890F0', Psychic:'#F85888', Bug:'#A8B820', Rock:'#B8A038',
				Ghost:'#705898', Dragon:'#7038F8', Dark:'#705848', Steel:'#B8B8D0', Fairy:'#EE99AC'
			};
			var c = typeColor[guardType] || '#888';
			return 'background-color:' + c + ';';
		},
		getGuardState: function (active) {
			if (!active || active.guardAction == null) return null;
			return {
				id: active.guardAction.id,
				name: active.guardAction.name,
				type: active.guardAction.type,
				cur: Number(active.guardAction.cur) || 0,
				max: Number(active.guardAction.max) || 1
			};
		},
		getGuardDisplay: function (rawCur, rawMax) {
			if (!Number.isFinite(rawCur)) rawCur = 0;
			if (!Number.isFinite(rawMax) || rawMax <= 0) rawMax = 2;
			var pct = Math.round(rawCur / rawMax * 100);
			if (pct < 0) pct = 0;
			if (pct > 100) pct = 100;
			return {cur: rawCur, max: rawMax, pct: pct};
		},
		getGuardHTML: function (active, pos) {
			if (!active || !active.guardAction) return ''; // no Guard Action on this Pokemon at all
			var st = this.getGuardState(active);
			if (!st) return '';
			var d = this.getGuardDisplay(st.cur, st.max);
			var ready = st.cur >= st.max;
			var turns = ready ? '' : Math.max(0, st.max - st.cur);
			var guardType = st.type || 'Normal';
			var tooltipArgs = 'guardaction|' + st.id + '|' + pos + '|' + st.cur + '|' + st.max;
			var btn = '' +
				'<button class="button guardbutton has-tooltip' + (ready ? ' ready' : '') + '" type="button" name="guard" ' + (ready ? '' : 'disabled ') +
					'data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '" ' + 'style="' + this.getGuardActionColorStyle(guardType) + '" ' + 'aria-label="Guard Action: ' + BattleLog.escapeHTML(st.name) + '">' +
					'<span class="guard-fill" style="width:' + d.pct + '%"></span>' +
					'<span class="guard-count">' + (ready ? '' : turns) + '</span>' +
					'<span class="guard-icon"><i class="fa fa-shield"></i></span>' +
				'</button>';
			return btn + '<span class="guard-divider"></span>';
		},
		stopTeraChargeAnim: function () {
			if (this._teraChargeAnimRaf) {
				cancelAnimationFrame(this._teraChargeAnimRaf);
				this._teraChargeAnimRaf = null;
			}
			this._teraChargeAnimStart = null;
			this._teraChargeAnimating = false;
			this._teraChargeAnimTargetCur = null;
			this._teraChargeAnimTargetMax = null;
			this._teraChargeAnimBtnEl = null;
		},
		animateTeraChargeTo: function ($btn, startCur, targetCur, max, opts) {
			if (!$btn || !$btn.length) return;
			// display units
			if (!Number.isFinite(startCur)) startCur = 0;
			if (!Number.isFinite(targetCur)) targetCur = 0;
			if (!Number.isFinite(max) || max <= 0) max = 100;
			// clamp
			startCur = Math.max(0, Math.min(max, startCur));
			targetCur = Math.max(0, Math.min(max, targetCur));
			if (Math.round(startCur) === targetCur && this._teraChargeDisplayMax === max) {
				this._teraChargeDisplayCur = targetCur;
				this._teraChargeDisplayMax = max;
				$btn.find('.teracharge-left').text(targetCur);
				$btn.find('.teracharge-fill').css({transition: '', width: Math.max(0, Math.min(100, (targetCur / max) * 100)) + '%'});
				this._teraChargeAnimating = false;
				this._teraChargeAnimBtnEl = $btn[0];
				this._teraChargeAnimTargetCur = targetCur;
				this._teraChargeAnimTargetMax = max;
				return;
			}
			// Cancel any existing animation
			if (this._teraChargeAnimTimer) {
				clearInterval(this._teraChargeAnimTimer);
				this._teraChargeAnimTimer = null;
			}
			// Mark animation state for updateTeraCharge's guard logic
			this._teraChargeAnimating = true;
			this._teraChargeAnimTargetCur = targetCur;
			this._teraChargeAnimTargetMax = max;
			this._teraChargeAnimBtnEl = $btn[0];
			// Cache max
			this._teraChargeDisplayMax = max;
			var $fill = $btn.find('.teracharge-fill');
			var $left = $btn.find('.teracharge-left');
			var duration = (opts && opts.duration != null) ? opts.duration : 650;
			var startTime = Date.now();
			var endTime = startTime + duration;
			this._teraChargeAnimTimer = setInterval(() => {
				// If controls re-rendered and $btn got detached, stop.
				if (!this.$controls || !$btn[0] || !document.documentElement.contains($btn[0])) {
					clearInterval(this._teraChargeAnimTimer);
					this._teraChargeAnimTimer = null;
					this._teraChargeAnimating = false;
					return;
				}
				var now = Date.now();
				var t = (now - startTime) / duration;
				if (t < 0) t = 0;
				if (t > 1) t = 1;
				// easing (smooth bar fill. Lower the number for snappier, higher for slower)
				var eased = 1 - Math.pow(1 - t, 4);
				var cur = startCur + (targetCur - startCur) * eased;
				cur = Math.max(0, Math.min(max, cur));
				$left.text(Math.round(cur));
				$fill.css({transition: '', width: Math.max(0, Math.min(100, (cur / max) * 100)) + '%'});
				this._teraChargeDisplayCur = cur;
				if (t >= 1) {
					clearInterval(this._teraChargeAnimTimer);
					this._teraChargeAnimTimer = null;
					this._teraChargeDisplayCur = targetCur;
					this._teraChargeDisplayMax = max;
					$left.text(targetCur);
					$fill.css({transition: '', width: Math.max(0, Math.min(100, (targetCur / max) * 100)) + '%'});
					this._teraChargeAnimating = false;
					// keep btnEl/targets as the “current animation state” for the guard
					this._teraChargeAnimBtnEl = $btn[0];
					this._teraChargeAnimTargetCur = targetCur;
					this._teraChargeAnimTargetMax = max;
				}
			}, 16);
		},
		updateTeraCharge: function () {
			if (!this.$controls) return;
			var st = this.getMyTeraChargeState();
			if (!st) return; 
			var rawCur = st.cur;
			var rawMax = st.max;
			var d = this.getTeraChargeDisplay(rawCur, rawMax);
			var cur = d.cur;
			var max = d.max;	// 100
			var $btn = this.$controls.find('.terachargebutton');
			if (!$btn.length) return;
			// what is currently shown (rounded, because cache may be float mid-animation)
			var shownCur = (this._teraChargeDisplayCur == null) ? null : Math.round(this._teraChargeDisplayCur);
			// If any of *your* Pokémon is currently terastallized (field OR back), you cannot arm Tera again.
			var mySide = this.battle && this.battle.mySide;
			var alreadyTera = !!(mySide && mySide.pokemon && mySide.pokemon.some(function (p) { return !!p.terastallized; }));
			if (alreadyTera) {
				this.terastallizeArmedIndex = null;
				$btn.attr('aria-label', 'Tera is already active (only one Pokémon may be Terastallized at a time).');
				$btn.attr('data-tooltip', 'teracharge|' + rawCur + '|' + rawMax + '|1');
				$btn.addClass('teracharge-disabled');
				$btn.find('.teracharge-typeicon').hide();
				if (this._teraChargeDisplayCur == null || this._teraChargeDisplayMax == null) {
					this._teraChargeDisplayCur = cur;
					this._teraChargeDisplayMax = max;
					var pctInit = Math.max(0, Math.min(100, cur));
					$btn.find('.teracharge-fill').css({transition: '', width: pctInit + '%'});
					$btn.find('.teracharge-left').text(cur);
					return;
				}
				if (cur !== shownCur || max !== this._teraChargeDisplayMax) {
				var animMs = this._teraChargeNextAnimMs;
				this._teraChargeNextAnimMs = null;
				this.animateTeraChargeTo(
					$btn,
					this._teraChargeDisplayCur,
					cur,
					max,
					animMs ? {duration: animMs} : null
				);
				} else { // controls may have re-rendered; ensure DOM matches cache
				var pctSameT = Math.max(0, Math.min(100, shownCur));
				$btn.find('.teracharge-fill').css({transition: '', width: pctSameT + '%'});
				$btn.find('.teracharge-left').text(shownCur);
				}
				return;
			} else { $btn.removeClass('teracharge-disabled'); }
			// Normal (not already tera)
			$btn.attr('aria-label', 'Tera Charge: ' + cur + '/' + max);
			$btn.attr('data-tooltip', 'teracharge|' + rawCur + '|' + rawMax);
			if (this._teraChargeDisplayCur == null || this._teraChargeDisplayMax == null) {
				this._teraChargeDisplayCur = cur;
				this._teraChargeDisplayMax = max;
				var pct0 = Math.max(0, Math.min(100, cur));
				$btn.find('.teracharge-fill').css({transition: '', width: pct0 + '%'});
				$btn.find('.teracharge-left').text(cur);
			} else if (cur !== shownCur || max !== this._teraChargeDisplayMax) {
				// If we are already animating *to this exact target*, don’t restart.
				if (this._teraChargeAnimating && this._teraChargeAnimTargetCur === cur && this._teraChargeAnimTargetMax === max) {
					// If controls re-rendered mid-animation, restart the animation on the new button element.
					if (this._teraChargeAnimBtnEl !== $btn[0]) {
						var animMs = this._teraChargeNextAnimMs;
						this._teraChargeNextAnimMs = null;
						this.animateTeraChargeTo(
							$btn,
							this._teraChargeDisplayCur,
							cur,
							max,
							animMs ? {duration: animMs} : null
						);
					}
				} else {
					var animMs = this._teraChargeNextAnimMs;
					this._teraChargeNextAnimMs = null;
					this.animateTeraChargeTo(
						$btn,
						this._teraChargeDisplayCur,
						cur,
						max,
						animMs ? {duration: animMs} : null
					);
				}
			} else { // No change: keep consistent (e.g. after controls re-render)
				var pctSame = Math.max(0, Math.min(100, shownCur));
				$btn.find('.teracharge-fill').css({transition: '', width: pctSame + '%'});
				$btn.find('.teracharge-left').text(shownCur);
			}
			var $fill = $btn.find('.teracharge-fill');
			var $iconWrap = $btn.find('.teracharge-typeicon');
			var $iconImg = $btn.find('.teracharge-typeicon-img');
			var choiceIndex = (this.choice && this.choice.choices) ? this.choice.choices.length : 0;
			var teraType = this.canTerastallize;
			var isTeraArmed = (this.terastallizeArmedIndex === choiceIndex);
			var isEmpowerArmed = (this.teraEmpowerArmedIndex === choiceIndex);
			// Reset visuals every time
			$fill.css({background: '', 'background-color': ''});
			$iconWrap.hide();
			if (isEmpowerArmed && !isTeraArmed) {
				$fill.css({
					'background-color': '#c0392b'
				});
				$iconWrap.hide();
				$btn.attr('title', 'Tera Empower armed');
			}
			if (isTeraArmed && teraType) {  // shows icon when armed, also change color if bar is full
				if (rawCur >= rawMax) { 
					if (teraType === 'Stellar') {
						$fill.css({
							background: 'linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#00ffff,#0000ff,#8b00ff)',
							'background-color': ''
						});
					} else {
						var typeColor = {
							Normal:'#A8A878', Fire:'#F08030', Water:'#6890F0', Electric:'#F8D030', Grass:'#78C850',
							Ice:'#98D8D8', Fighting:'#C03028', Poison:'#A040A0', Ground:'#E0C068',
							Flying:'#A890F0', Psychic:'#F85888', Bug:'#A8B820', Rock:'#B8A038',
							Ghost:'#705898', Dragon:'#7038F8', Dark:'#705848', Steel:'#B8B8D0', Fairy:'#EE99AC'
						};
						var c = typeColor[teraType] || '#888';
						$fill.css({'background-color': c});
					}
				}
				$iconWrap.show();
				$iconImg.attr('src', 'https://indigostarstorm.com/sprites/types/Tera' + teraType + '.png');
			}
		},
		toggleTerastallize: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			// Only allow during move selection
			if (!this.request || !this.request.active || !this.choice || !this.choice.choices) return;
			// if you already have a Terastallized mon anywhere (field OR back), you cannot arm Tera again
			var mySide = this.battle && this.battle.mySide;
			var alreadyTera = !!(mySide && mySide.pokemon && mySide.pokemon.some(function (p) { return !!p.terastallized; }));
			if (alreadyTera) return;
			var st = this.getMyTeraChargeState();
			if (!st) return;
			var cur = st.cur;
			var max = st.max;
			if (!(this.canTerastallize && cur >= max)) return;
			var choiceIndex = this.choice.choices.length;
			if (this.terastallizeArmedIndex === choiceIndex) { this.terastallizeArmedIndex = null; } 
			else {
				this.terastallizeArmedIndex = choiceIndex;
				this.teraEmpowerArmedIndex = null;
			}
			this.$('input[name=terastallize]').prop('checked', this.terastallizeArmedIndex === choiceIndex);
			this.updateTeraCharge();
		},
		toggleTeraEmpower: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			// Only allow during move selection
			if (!this.request || !this.request.active || !this.choice || !this.choice.choices) return;
			var st = this.getMyTeraChargeState();
			if (!st) return;
			var cur = st.cur;
			var max = st.max;
			if (!(this.canTeraEmpower && cur < max && cur >= 10)) return;
			var choiceIndex = this.choice.choices.length;
			// Toggle for THIS slot; only one slot can be armed at a time
			if (this.teraEmpowerArmedIndex === choiceIndex) { this.teraEmpowerArmedIndex = null; } 
			else {
				this.teraEmpowerArmedIndex = choiceIndex;
				this.terastallizeArmedIndex = null;
			}
			this.updateTeraCharge();
		},
		teraChargeHoverOn: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			this._teraChargeHovering = true;
			this.updateTeraCharge();
		},
		teraChargeHoverOff: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			this._teraChargeHovering = false;
			this.updateTeraCharge();
		},
		toggleTeraCharge: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			var st = this.getMyTeraChargeState();
			if (!st) return;
			var cur = st.cur;
			var max = st.max;
			if (this.canTerastallize && cur >= max) { this.toggleTerastallize(e); } 
			else if (this.canTeraEmpower && cur < max && cur >= 10) { this.toggleTeraEmpower(e); }
			this.updateControlsForPlayer();
			this.updateTeraCharge();
		},
		uncheckMegaEvoX: function () { this.$('input[name=megaevox]').prop('checked', false); },
		uncheckMegaEvoY: function () { this.$('input[name=megaevoy]').prop('checked', false); },
		uncheckMegaEvoZ: function () { this.$('input[name=megaevoz]').prop('checked', false); },
		uncheckMegaEvoA: function () { this.$('input[name=megaevoa]').prop('checked', false); },
		uncheckMegaEvoQ: function () { this.$('input[name=megaevoq]').prop('checked', false); },
		updateTimer: function () { this.$('.timerbutton').replaceWith(this.getTimerHTML()); },
		openTimer: function () { app.addPopup(TimerPopup, { room: this }); },
		updateMoveControls: function (type) {
			var switchables = this.request && this.request.side ? this.battle.myPokemon : [];
			// Fresh move requests must never reuse a team-preview choice object.
			if (!this.choice || this.choice.teamPreview || !Array.isArray(this.choice.choices)) {
				this.choice = {
					choices: [],
					switchFlags: {},
					switchOutFlags: {}
				};
				type = '';
			}
			if (type !== 'movetarget') {
				while (
					switchables[this.choice.choices.length] &&
					(switchables[this.choice.choices.length].fainted || switchables[this.choice.choices.length].commanding) &&
					this.choice.choices.length + 1 < this.battle.nearSide.active.length
				) { this.choice.choices.push('pass'); }
			}
			var moveTarget = this.choice ? this.choice.moveTarget : '';
			var pos = this.choice.choices.length;
			if (type === 'movetarget') pos--;
			var curActive = this.request && this.request.active && this.request.active[pos];
			// If pos somehow drifted out of range, reset to the current slot instead of leaving stale UI onscreen.
			if (!curActive) {
				this.choice.choices = [];
				this.choice.type = '';
				pos = 0;
				curActive = this.request && this.request.active && this.request.active[pos];
				if (!curActive) {
					this.$controls.html('<div class="controls"><p>Waiting for a valid move request...</p></div>');
					return;
				}
			}
			var hpRatio = switchables[pos].hp / switchables[pos].maxhp;
			var trapped = curActive.trapped;
			var canMegaEvo = curActive.canMegaEvo || switchables[pos].canMegaEvo;
			var canMegaEvoX = curActive.canMegaEvoX || switchables[pos].canMegaEvoX;
			var canMegaEvoY = curActive.canMegaEvoY || switchables[pos].canMegaEvoY;
			var canMegaEvoZ = curActive.canMegaEvoZ || switchables[pos].canMegaEvoZ;
			var canMegaEvoA = curActive.canMegaEvoA || switchables[pos].canMegaEvoA;
			var canMegaEvoQ = curActive.canMegaEvoQ || switchables[pos].canMegaEvoQ;
			this.canMegaEvoLetter = canMegaEvoX ? 'X' : canMegaEvoY ? 'Y' : canMegaEvoZ ? 'Z' : canMegaEvoA ? 'A' : canMegaEvoQ ? 'Q' : null;
			var canZMove = curActive.canZMove || switchables[pos].canZMove;
			var canUltraBurst = curActive.canUltraBurst || switchables[pos].canUltraBurst;
			var canTerastallize = curActive.canTerastallize || switchables[pos].canTerastallize;
			this.canTerastallize = canTerastallize;
			var canTeraEmpower = !!curActive.canTeraEmpower;
			this.canTeraEmpower = canTeraEmpower;
			var guardHTML = this.getGuardHTML(curActive, pos);
			var guardActivePos = this.battle.mySide.n > 1 ? pos + this.battle.pokemonControlled : pos;
			var guardLivePokemon = this.battle.nearSide.active[guardActivePos];
			if (guardLivePokemon) {
				if (curActive.guardAction) {
					guardLivePokemon.guardActionMoveId = curActive.guardAction.id;
					guardLivePokemon.guardActionCur = curActive.guardAction.cur;
					guardLivePokemon.guardActionMax = curActive.guardAction.max;
				} else {
					guardLivePokemon.guardActionMoveId = '';
					guardLivePokemon.guardActionCur = 0;
					guardLivePokemon.guardActionMax = 0;
				}
			}
			this.finalDecisionMove = curActive.maybeDisabled || false;
			this.finalDecisionSwitch = curActive.maybeTrapped || false;
			for (var k = pos + 1; k < this.battle.nearSide.active.length; ++k) {
				var p = this.battle.nearSide.active[k];
				if (p && !p.fainted) {
					this.finalDecisionMove = this.finalDecisionSwitch = false;
					break;
				}
			}
			var requestTitle = '';
			if (type === 'move2' || type === 'movetarget') requestTitle += '<button name="clearChoice">Back</button> ';
			// target selector
			if (type === 'movetarget') {
				requestTitle += 'At who? ';
				var activePos = this.battle.mySide.n > 1 ? pos + this.battle.pokemonControlled : pos;
				var targetMenus = ['', ''];
				var nearActive = this.battle.nearSide.active;
				var farActive = this.battle.farSide.active;
				var farSlot = farActive.length - 1 - activePos;
				if ((moveTarget === 'adjacentAlly' || moveTarget === 'adjacentFoe') && this.battle.gameType === 'freeforall') { moveTarget = 'normal'; }
				for (var i = farActive.length - 1; i >= 0; i--) {
					var foe = farActive[i];
					var tooltipArgsF = 'activepokemon|1|' + i;
					var disabledF = false;
					if (moveTarget === 'adjacentAlly' || moveTarget === 'adjacentAllyOrSelf') disabledF = true;
					else if (moveTarget === 'normal' || moveTarget === 'adjacentFoe') { if (Math.abs(farSlot - i) > 1) disabledF = true; }
					if (disabledF) { targetMenus[0] += '<button disabled></button> '; } 
					else if (!foe || foe.fainted) { targetMenus[0] += '<button name="chooseMoveTarget" value="' + (i + 1) + '"><span class="picon" style="' + Dex.getPokemonIcon('missingno') + '"></span></button> '; } 
					else {
						targetMenus[0] += '<button name="chooseMoveTarget" value="' + (i + 1) + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgsF) + '"><span class="picon" style="' + Dex.getPokemonIcon(foe) + '"></span>' +
							(this.battle.ignoreOpponent || this.battle.ignoreNicks ? foe.speciesForme : BattleLog.escapeHTML(foe.name)) +
							'<span class="' + foe.getHPColorClass() + '"><span style="width:' + (Math.round(foe.hp * 92 / foe.maxhp) || 1) + 'px"></span></span>' +
							(foe.status ? '<span class="status ' + foe.status + '"></span>' : '') +
							'</button> ';
					}
				}
				for (var j = 0; j < nearActive.length; j++) {
					var ally = nearActive[j];
					var tooltipArgsA = 'activepokemon|0|' + j;
					var disabledA = false;
					if (moveTarget === 'adjacentFoe') disabledA = true;
					else if (moveTarget === 'normal' || moveTarget === 'adjacentAlly' || moveTarget === 'adjacentAllyOrSelf') { if (Math.abs(activePos - j) > 1) disabledA = true; }
					if (moveTarget !== 'adjacentAllyOrSelf' && activePos === j) disabledA = true;
					if (disabledA) { targetMenus[1] += '<button disabled style="visibility:hidden"></button> '; } 
					else if (!ally || ally.fainted) { targetMenus[1] += '<button name="chooseMoveTarget" value="' + (-(j + 1)) + '"><span class="picon" style="' + Dex.getPokemonIcon('missingno') + '"></span></button> '; } 
					else {
						targetMenus[1] += '<button name="chooseMoveTarget" value="' + (-(j + 1)) + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgsA) + '"><span class="picon" style="' + Dex.getPokemonIcon(ally) + '"></span>' +
							BattleLog.escapeHTML(ally.name) +
							'<span class="' + ally.getHPColorClass() + '"><span style="width:' + (Math.round(ally.hp * 92 / ally.maxhp) || 1) + 'px"></span></span>' +
							(ally.status ? '<span class="status ' + ally.status + '"></span>' : '') +
							'</button> ';
					}
				}
				this.$controls.html(
					'<div class="controls">' +
						'<div class="whatdo">' + this.getWhatDoHTML(requestTitle, guardHTML) + '</div>' +
						'<div class="switchmenu" style="display:block">' + targetMenus[0] + '<div style="clear:both"></div></div>' +
						'<div class="switchmenu" style="display:block">' + targetMenus[1] + '</div>' +
					'</div>'
				);
				return;
			}
			// move chooser
			var hpBar = '<small class="' + (hpRatio < 0.2 ? 'critical' : hpRatio < 0.5 ? 'weak' : 'healthy') + '">HP ' + switchables[pos].hp + '/' + switchables[pos].maxhp + '</small>';
			requestTitle += ' What will <strong>' + BattleLog.escapeHTML(switchables[pos].name) + '</strong> do?';
			var hasMoves = false;
			var moveMenu = '';
			var movebuttons = '';
			var activePos2 = this.battle.mySide.n > 1 ? pos + this.battle.pokemonControlled : pos;
			var typeValueTracker = new ModifiableValue(this.battle, this.battle.nearSide.active[activePos2], this.battle.myPokemon[pos]);
			for (var m = 0; m < curActive.moves.length; m++) {
				var moveData = curActive.moves[m];
				var move = this.battle.dex.moves.get(moveData.move);
				var name = move.name;
				var pp = moveData.pp + '/' + moveData.maxpp;
				if (!moveData.maxpp) pp = '&ndash;';
				if (move.id === 'Struggle' || move.id === 'Recharge') pp = '&ndash;';
				if (move.id === 'Recharge') move.type = '&ndash;';
				if (name.substr(0, 12) === 'Hidden Power') name = 'Hidden Power';
				var moveType = this.tooltips.getMoveType(move, typeValueTracker)[0];
				var moveType2 = move.type2 || null;
				var tooltipArgs = 'move|' + moveData.move + '|' + pos;
				var dualStyle = moveType2 ? this.getDualTypeStyle(moveType, moveType2) : null;
				var typeClass = 'type-' + moveType + (dualStyle ? ' dual-type' : '');
				var styleAttr = dualStyle ? ' style="' + dualStyle.buttonStyle + '"' : '';
				if (moveData.disabled) { movebuttons += '<button disabled class="movebutton has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">'; } 
				else {
					movebuttons += '<button class="movebutton ' + typeClass + ' has-tooltip"' + styleAttr + ' name="chooseMove" value="' + (m + 1) + '" data-move="' + BattleLog.escapeHTML(moveData.move) + '" data-target="' + BattleLog.escapeHTML(moveData.target) + '" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">';
					hasMoves = true;
				}
				var smallStyle = dualStyle ? ' style="' + dualStyle.textStyle + '"' : '';
				var typeLabel = moveType ? Dex.getTypeIcon(moveType, false, moveType2) : "Unknown";
				movebuttons += BattleLog.escapeHTML(name) + '<br />' + '<small class="type"' + smallStyle + '>' + typeLabel + '</small> <small class="pp"' + smallStyle + '>' + pp + '</small>&nbsp;</button> ';
			}
			if (!hasMoves) { moveMenu += '<button class="movebutton" name="chooseMove" value="0" data-move="Struggle" data-target="randomNormal">Struggle<br /><small class="type">Normal</small> <small class="pp">&ndash;</small>&nbsp;</button> '; } 
			else { moveMenu += movebuttons; }
			var checkboxes = [];
			if (canUltraBurst) checkboxes.push('<label class="megaevo"><input type="checkbox" name="ultraburst" />&nbsp;Ultra Burst</label>');
			if (canTerastallize) checkboxes.push('<input type="checkbox" name="terastallize" style="display:none" />');
			// if not full, ensure not armed
			var stTC = this.getMyTeraChargeState();
			var tcCur = stTC ? stTC.cur : 0;
			var tcMax = stTC ? stTC.max : 0;
			var canTerastalNow = !!(canTerastallize && tcMax && tcCur >= tcMax);
			var canEmpowerNow = !!(canTeraEmpower && tcCur < tcMax && tcCur >= 10);
			if (!canTerastalNow) this.terastallizeArmedIndex = null;
			if (!canEmpowerNow) this.teraEmpowerArmedIndex = null;
			var stMC = this.getMyMegaChargeState();
			var mcCur = stMC ? stMC.cur : 0;
			var mcMax = stMC ? stMC.max : 0;
			var canMegaEvoNow = !!(this.canMegaEvoLetter && mcMax && mcCur >= mcMax);
			if (!canMegaEvoNow) this.megaEvoArmedIndex = null;
			if (checkboxes.length) moveMenu += '<div class="megaevo-box">' + checkboxes.join('') + '</div>';
			if (this.finalDecisionMove) moveMenu += '<em class="movewarning">You <strong>might</strong> have some moves disabled, so you won\'t be able to cancel an attack!</em>';
			if (curActive.maybeLocked) moveMenu += '<em class="movewarning">You <strong>might</strong> be locked into a move. <button class="button" name="chooseFight">Try Fight button</button> (prevents switching if you\'re locked)</em>';
			moveMenu += '<div style="clear:left"></div>';
			var moveControls = (
				'<div class="movecontrols">' +
					'<div class="moveselect"><button name="selectMove">Attack</button></div>' +
					'<div class="movemenu">' + moveMenu + '</div>' +
				'</div>'
			);
			var shiftControls = '';
			if (this.battle.gameType === 'triples' && pos !== 1) {
				shiftControls = (
					'<div class="shiftcontrols">' +
						'<div class="shiftselect"><button name="chooseShift">Shift</button></div>' +
						'<div class="switchmenu"><button name="chooseShift">Shift to Center</button><div style="clear:left"></div></div>' +
					'</div>'
				);
			}
			var switchMenu = '';
			if (trapped) {
				switchMenu += '<em>You are trapped and cannot switch!</em><br />';
				switchMenu += this.displayParty(switchables, trapped);
			} else {
				switchMenu += this.displayParty(switchables, trapped);
				if (this.finalDecisionSwitch && this.battle.gen > 2) { switchMenu += '<em class="movewarning">You <strong>might</strong> be trapped, so you won\'t be able to cancel a switch!</em>'; }
			}
			var switchControls = (
				'<div class="switchcontrols">' +
					'<div class="switchselect"><button name="selectSwitch">Switch</button></div>' +
					'<div class="switchmenu">' + switchMenu + '</div>' +
				'</div>'
			);
			this.$controls.html(
				'<div class="controls">' +
					'<div class="whatdo">' + this.getWhatDoHTML(requestTitle, guardHTML) + '</div>' +
					moveControls + shiftControls + switchControls +
				'</div>'
			);
		},
		displayParty: function (switchables, trapped) {
			var party = '';
			for (var i = 0; i < switchables.length; i++) {
				var pokemon = switchables[i];
				pokemon.name = pokemon.ident.substr(4);
				var tooltipArgs = 'switchpokemon|' + i;
				if (pokemon.fainted || i < this.battle.pokemonControlled || this.choice.switchFlags[i] || trapped) { party += '<button class="disabled has-tooltip" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + (pokemon.fainted ? ',fainted' : trapped ? ',trapped' : i < this.battle.nearSide.active.length ? ',active' : '') + '" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (pokemon.hp ? '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> '; } 
				else { party += '<button name="chooseSwitch" value="' + i + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> '; }
			}
			if (this.battle.mySide.ally) party += this.displayAllyParty();
			return party;
		},
		displayAllyParty: function () {
			var party = '';
			if (!this.battle.myAllyPokemon) return '';
			var allyParty = this.battle.myAllyPokemon;
			for (var i = 0; i < allyParty.length; i++) {
				var pokemon = allyParty[i];
				pokemon.name = pokemon.ident.substr(4);
				var tooltipArgs = 'allypokemon|' + i;
				party += '<button class="disabled has-tooltip" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + ',notMine' + '" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (pokemon.hp ? '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> ';
			}
			return party;
		},
		updateSwitchControls: function (type) {
			var pos = this.choice.choices.length;
			// Needed so it client does not freak out when only 1 mon left wants to switch out
			var atLeast1Reviving = false;
			for (var i = 0; i < this.battle.pokemonControlled; i++) {
				var pokemon = this.battle.myPokemon[i];
				if (pokemon.reviving) {
					atLeast1Reviving = true;
					break;
				}
			}
			if (type !== 'switchposition' && this.request.forceSwitch !== true && (!this.choice.freedomDegrees || atLeast1Reviving)) { while (!this.request.forceSwitch[pos] && pos < 6) { pos = this.choice.choices.push('pass'); } }
			var switchables = this.request && this.request.side ? this.battle.myPokemon : [];
			// var nearActive = this.battle.nearSide.active;
			var isReviving = !!switchables[pos].reviving;
			var requestTitle = '';
			if (type === 'switch2' || type === 'switchposition') { requestTitle += '<button name="clearChoice">Back</button> '; }
			// Place selector
			if (type === 'switchposition') {
				// TODO? hpbar
				requestTitle += "Which Pokémon will it switch in for?";
				var controls = '<div class="switchmenu" style="display:block">';
				for (var i = 0; i < this.battle.pokemonControlled; i++) {
					var pokemon = this.battle.myPokemon[i];
					var tooltipArgs = 'switchpokemon|' + i;
					if (pokemon && !pokemon.fainted || this.choice.switchOutFlags[i]) { controls += '<button disabled class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (!pokemon.fainted ? '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> '; } 
					else if (!pokemon) { controls += '<button disabled></button> '; } 
					else { controls += '<button name="chooseSwitchTarget" value="' + i + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> '; }
				}
				controls += '</div>';
				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + this.getWhatDoHTML(requestTitle) + '</div>' +
					controls +
					'</div>'
				);
			} else {
				if (isReviving) { requestTitle += "Choose a fainted Pokémon to revive!"; } 
				else if (this.choice.freedomDegrees >= 1) { requestTitle += "Choose a Pokémon to send to battle!"; } 
				else { requestTitle += "Switch <strong>" + BattleLog.escapeHTML(switchables[pos].name) + "</strong> to:"; }
				var switchMenu = '';
				for (var i = 0; i < switchables.length; i++) {
					var pokemon = switchables[i];
					var tooltipArgs = 'switchpokemon|' + i;
					if (isReviving) {
						if (!pokemon.fainted || this.choice.switchFlags[i]) { switchMenu += '<button class="disabled has-tooltip" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + (pokemon.reviving ? ',active' : !pokemon.fainted ? ',notfainted' : '') + '" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">'; } 
						else { switchMenu += '<button name="chooseSwitch" value="' + i + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">'; }
					} else {
						if (pokemon.fainted || i < this.battle.pokemonControlled || this.choice.switchFlags[i]) { switchMenu += '<button class="disabled has-tooltip" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + (pokemon.fainted ? ',fainted' : i < this.battle.pokemonControlled ? ',active' : '') + '" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">'; } 
						else { switchMenu += '<button name="chooseSwitch" value="' + i + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '">'; }
					}
					switchMenu += '<span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (!pokemon.fainted ? '<span class="' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> ';
				}
				var controls = (
					'<div class="switchcontrols">' +
					'<div class="switchselect"><button name="selectSwitch">' + (isReviving ? 'Revive' : 'Switch') + '</button></div>' +
					'<div class="switchmenu">' + switchMenu + '</div>' +
					'</div>'
				);
				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + this.getWhatDoHTML(requestTitle) + '</div>' +
					controls +
					'</div>'
				);
				this.selectSwitch();
			}
		},
		updateTeamControls: function (type) {
			var switchables = this.request && this.request.side ? this.battle.myPokemon : [];
			var maxIndex = Math.min(switchables.length, 24);
			var requestTitle = "";
			if (this.choice.done) { requestTitle = '<button name="clearChoice">Back</button> ' + "What about the rest of your team?"; } 
			else { requestTitle = "How will you start the battle?"; }
			var switchMenu = '';
			for (var i = 0; i < maxIndex; i++) {
				var oIndex = this.choice.teamPreview[i] - 1;
				var pokemon = switchables[oIndex];
				var tooltipArgs = 'switchpokemon|' + oIndex;
				if (i < this.choice.done) { switchMenu += '<button disabled class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '</button> '; } 
				else { switchMenu += '<button name="chooseTeamPreview" value="' + i + '" class="has-tooltip" data-tooltip="' + BattleLog.escapeHTML(tooltipArgs) + '"><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '</button> '; }
			}
			var controls = (
				'<div class="switchcontrols">' +
				'<div class="switchselect"><button name="selectSwitch">' + (this.choice.done ? '' + "Choose a Pokémon for slot " + (this.choice.done + 1) : "Choose Lead") + '</button></div>' +
				'<div class="switchmenu">' + switchMenu + '</div>' +
				'</div>'
			);
			this.$controls.html(
				'<div class="controls">' +
				'<div class="whatdo">' + this.getWhatDoHTML(requestTitle) + '</div>' +
				controls +
				'</div>'
			);
			this.selectSwitch();
		},
		updateWaitControls: function () {
			var buf = '<div class="controls">';
			buf += this.getPlayerChoicesHTML();
			if (!this.battle.nearSide.name || !this.battle.farSide.name || !this.request) {
				if (this.battle.kickingInactive) { buf += '<p><button class="button" name="setTimer" value="off">Stop timer</button> <small>&larr; Your opponent has disconnected. This will give them more time to reconnect.</small></p>'; } 
				else { buf += '<p><button class="button" name="setTimer" value="on">Claim victory</button> <small>&larr; Your opponent has disconnected. Click this if they don\'t reconnect.</small></p>'; }
			}
			this.$controls.html(buf + '</div>');
		},
		getPlayerChoicesHTML: function () {
			var buf = '<p>' + this.getTimerHTML() + this.getTeraChargeHTML();
			// Only show the waiting summary when we are actually waiting.
			if (!this.choice || !this.choice.waiting) return buf + '</p>';
			buf += '<small>';
			if (this.choice.teamPreview) {
				var myPokemon = this.battle.mySide.pokemon;
				var leads = [];
				var back = [];
				var leadCount = this.battle.gameType === 'doubles' ? 2 : (this.battle.gameType === 'triples' ? 3 : 1);
				for (var i = 0; i < leadCount; i++) { leads.push(myPokemon[this.choice.teamPreview[i] - 1].speciesForme); }
				buf += leads.join(', ') + ' will be sent out first.<br />';
				for (var i = leadCount; i < this.choice.count; i++) { back.push(myPokemon[this.choice.teamPreview[i] - 1].speciesForme); }
				if (back.length) buf += back.join(', ') + ' are in the back.<br />';
			} else if (this.choice.choices && this.request && this.battle.myPokemon) {
				var myPokemon = this.battle.myPokemon;
				for (var i = 0; i < this.choice.choices.length; i++) {
					if (!this.choice.choices[i]) continue;
					var parts = this.choice.choices[i].split(' ');
					switch (parts[0]) {
					case 'move':
						var move;
						if (this.request.active[i].maxMoves && !this.request.active[i].canDynamax) { move = this.request.active[i].maxMoves.maxMoves[parseInt(parts[1], 10) - 1].move; } 
						else { move = this.request.active[i].moves[parseInt(parts[1], 10) - 1].move; }
						var target = '';
						buf += myPokemon[i].speciesForme + ' will ';
						if (parts.length > 2) {
							var targetPos = parts[2];
							if (targetPos === 'mega') {
								buf += 'Mega Evolve, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'megax') {
								buf += 'Mega Evolve X, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'megay') {
								buf += 'Mega Evolve Y, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'megaz') {
								buf += 'Mega Evolve Z, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'megaa') {
								buf += 'Mega Evolve A, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'megaq') {
								buf += 'Mega Evolve Q, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'ultra') {
								buf += 'Ultra Burst, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'terastallize') {
								buf += 'Terastallize, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'teraempower') {
								buf += 'Tera Empower, then ';
								targetPos = parts[3];
							}
							if (targetPos) {
								var targetActive = this.battle.farSide.active;
								if (targetPos < 0) {
									targetActive = this.battle.nearSide.active;
									targetPos = -targetPos;
									if (this.battle.gameType !== 'freeforall') target += 'your ';
								}
								if (targetActive[targetPos - 1]) target += targetActive[targetPos - 1].speciesForme;
								else target += 'slot ' + targetPos;
							}
						}
						buf += 'use ' + Dex.moves.get(move).name + (target ? ' at ' + target : '') + '.<br />';
						break;
					case 'switch':
						buf += myPokemon[parts[1] - 1].speciesForme + ' will switch in';
						if (myPokemon[i]) buf += ', replacing ' + myPokemon[i].speciesForme;
						buf += '.<br />';
						break;
					case 'shift':
						buf += myPokemon[i].speciesForme + ' will shift position.<br />';
						break;
					case 'testfight':
						buf += myPokemon[i].speciesForme + ' is locked into a move.<br />';
						break;
					}
				}
			}
			buf += '</small></p>';
			if (!this.finalDecision && !this.battle.hardcoreMode) { buf += '<p><small><em>Waiting for opponent...</em></small> <button class="button" name="undoChoice">Cancel</button></p>'; }
			return buf;
		},
		/**
		 * Sends a decision; pass it an array of choices like ['move 1', 'switch 2'] and it'll send `/choose move 1,switch 2|3` (where 3 is the rqid).
		 * (The rqid helps verify that the decision is sent in response to the correct request.)
		 * In a dual-seat test battle, suffixes with this window's seat (`:p1`/`:p2`) so the
		 * server knows which of the two seats the choice belongs to.
		 */
		sendDecision: function (message) {
			var seatSuffix = this.dualSeat ? ':' + this.mySeat : '';
			if (!$.isArray(message)) return this.send('/' + message + '|' + this.request.rqid + seatSuffix);
			var buf = '/choose ';
			for (var i = 0; i < message.length; i++) { if (message[i]) buf += message[i] + ','; }
			this.send(buf.substr(0, buf.length - 1) + '|' + this.request.rqid + seatSuffix);
		},
		request: null,
		receiveRequest: function (request, choiceText) {
			if (!request) {
				this.side = '';
				return;
			}
			if (request.seat) {
				this.dualSeat = true;
				if (request.seat !== this.mySeat) {
					// Not this window's seat. Only the primary (p1) window opens a companion;
					// the companion just discards mirrored requests that aren't its own seat.
					if (!this.isCompanionSeat && !this.companionRoom) this.openCompanionSeat(request.seat);
					return;
				}
			}
			this.activateRequest(request, choiceText);
		},
		activateRequest: function (request, choiceText) {
			if (!this.autoTimerActivated && Storage.prefs('autotimer') && !this.battle.ended) {
				this.setTimer('on');
				this.autoTimerActivated = true;
			}
			request.requestType = 'move';
			if (request.forceSwitch) { request.requestType = 'switch'; } 
			else if (request.teamPreview) { request.requestType = 'team'; } 
			else if (request.wait) { request.requestType = 'wait'; }
			this.choice = choiceText ? {waiting: true} : null;
			this.finalDecision = this.finalDecisionMove = this.finalDecisionSwitch = false;
			this.request = request;
			if (request.side) { this.updateSideLocation(request.side); }
			this.notifyRequest();
			this.controlsShown = false;
			this.updateControls();
		},
		// Opens the p2 companion window in the side panel the first time a request
		// comes in for a seat this window doesn't own. Only ever called on the p1 room.
		openCompanionSeat: function (seat) {
			var companionId = this.id + '--' + seat;
			app.addRoom(companionId, 'battle', true, this.title + ' (' + (seat === 'p1' ? 'Player 1' : 'Player 2') + ')');
			var companion = app.rooms[companionId];
			if (!companion) return; // room creation failed - nothing more we can do here
			companion.isCompanionSeat = true;
			companion.mySeat = seat;
			companion.dualSeat = true;
			companion.battleRoomId = this.id;
			this.companionRoom = companion;
			for (var i = 0; i < this.rawLog.length; i++) { companion.add(this.rawLog[i]); }
			if (companion.battle) companion.battle.seekTurn(Infinity, true);
			if (typeof app.focusRoomRight === 'function') app.focusRoomRight(companionId);
			app.updateLayout();
		},
		notifyRequest: function () {
			var oName = this.battle.farSide.name;
			if (oName) oName = " against " + oName;
			switch (this.request.requestType) {
			case 'move':
				this.notify("Your move!", "Move in your battle" + oName, 'choice');
				break;
			case 'switch':
				this.notify("Your switch!", "Switch in your battle" + oName, 'choice');
				break;
			case 'team':
				this.notify("Team preview!", "Choose your team order in your battle" + oName, 'choice');
				break;
			}
		},
		updateSideLocation: function (sideData) {
			if (!sideData.id) return;
			this.side = sideData.id;
			if (this.battle.mySide.sideid !== this.side) {
				this.battle.setViewpoint(this.side);
				this.$chat = this.$chatFrame.find('.inner');
			}
		},
		updateSide: function () {
			var sideData = this.request.side;
			this.battle.myPokemon = sideData.pokemon;
			this.battle.setViewpoint(sideData.id);
			var mySide = this.battle.mySide;
			// Preserve full team only for preview + top bar.
			// Only initialize it once, before battle-start reshaping would matter.
			if (!mySide.fullTeam || !mySide.fullTeam.length) {
				mySide.fullTeam = [];
				for (var i = 0; i < sideData.pokemon.length; i++) {
					var previewData = sideData.pokemon[i];
					if (!previewData || !previewData.ident) continue;
					var previewPokemon = this.battle.getPokemon(previewData.ident);
					if (previewPokemon) mySide.fullTeam.push(previewPokemon);
				}
			}
			// Sidebar/live battle should always use the brought team only.
			mySide.sidebarPokemon = [];
			for (var j = 0; j < sideData.pokemon.length; j++) {
				var broughtData = sideData.pokemon[j];
				if (!broughtData || !broughtData.ident) continue;
				var broughtPokemon = this.battle.getPokemon(broughtData.ident);
				if (broughtPokemon) mySide.sidebarPokemon.push(broughtPokemon);
			}
			this.battle.scene.updateSidebars();
			// Keep the battlefield sidebar on the brought roster only.
			if (this.battle.mySide && this.battle.mySide.pokemon) {
				var broughtIdents = {};
				for (var i = 0; i < sideData.pokemon.length; i++) {
					var reqMon = sideData.pokemon[i];
					if (reqMon && reqMon.ident) broughtIdents[reqMon.ident] = true;
				}
				this.battle.mySide.sidebarPokemon = this.battle.mySide.pokemon.filter(function (pokemon) { return pokemon && broughtIdents[pokemon.ident]; });
				if (this.battle.scene && this.battle.scene.updateSidebar) { this.battle.scene.updateSidebar(this.battle.mySide); }
			}
			// Sync terastallized flags from the request into the live Battle Pokemon objects.
			// This fixes tooltips/UI still showing "(Terastallized)" after server ended it.
			if (sideData && sideData.pokemon) {
				for (var i = 0; i < sideData.pokemon.length; i++) {
					var p = sideData.pokemon[i];
					if (!p || !p.ident) continue;
					var bp = this.battle.getPokemon(p.ident);
					if (bp) bp.terastallized = p.terastallized || '';
				}
			}
			for (var i = 0; i < sideData.pokemon.length; i++) {
				var pokemonData = sideData.pokemon[i];
				this.battle.parseDetails(pokemonData.ident.substr(4), pokemonData.ident, pokemonData.details, pokemonData);
				this.battle.parseHealth(pokemonData.condition, pokemonData);
				pokemonData.hpDisplay = Pokemon.prototype.hpDisplay;
				pokemonData.getPixelRange = Pokemon.prototype.getPixelRange;
				pokemonData.getFormattedRange = Pokemon.prototype.getFormattedRange;
				pokemonData.getHPColorClass = Pokemon.prototype.getHPColorClass;``
				pokemonData.getHPColor = Pokemon.prototype.getHPColor;
			}
		},
		addAlly: function (allyData) {
			this.battle.myAllyPokemon = allyData.pokemon;
			for (var i = 0; i < allyData.pokemon.length; i++) {
				var pokemonData = allyData.pokemon[i];
				this.battle.parseDetails(pokemonData.ident.substr(4), pokemonData.ident, pokemonData.details, pokemonData);
				this.battle.parseHealth(pokemonData.condition, pokemonData);
				pokemonData.hpDisplay = Pokemon.prototype.hpDisplay;
				pokemonData.getPixelRange = Pokemon.prototype.getPixelRange;
				pokemonData.getFormattedRange = Pokemon.prototype.getFormattedRange;
				pokemonData.getHPColorClass = Pokemon.prototype.getHPColorClass;
				pokemonData.getHPColor = Pokemon.prototype.getHPColor;
				pokemonData.side = this.battle.mySide.ally;
			}
		},
		// buttons
		joinBattle: function () { this.send('/joinbattle'); },
		setTimer: function (setting) { this.send('/timer ' + setting); },
		forfeit: function () { this.send('/forfeit'); },
		saveReplay: function () { this.send('/savereplay'); },
		openBattleOptions: function () { app.addPopup(BattleOptionsPopup, { battle: this.battle, room: this }); },
		clickReplayDownloadButton: function (e) {
			var filename = (this.battle.tier || 'Battle').replace(/[^A-Za-z0-9]/g, '');
			// ladies and gentlemen, JavaScript dates
			var date = new Date();
			filename += '-' + date.getFullYear();
			filename += (date.getMonth() >= 9 ? '-' : '-0') + (date.getMonth() + 1);
			filename += (date.getDate() >= 10 ? '-' : '-0') + date.getDate();
			filename += '-' + toID(this.battle.p1.name);
			filename += '-' + toID(this.battle.p2.name);
			e.currentTarget.href = BattleLog.createReplayFileHref(this);
			e.currentTarget.download = filename + '.html';
			e.stopPropagation();
		},
		switchViewpoint: function () { this.battle.switchViewpoint(); },
		pause: function () {
			this.tooltips.hideTooltip();
			this.battlePaused = true;
			this.battle.pause();
			this.updateControls();
		},
		resume: function () {
			this.tooltips.hideTooltip();
			this.battlePaused = false;
			this.battle.play();
			this.updateControls();
		},
		instantReplay: function () {
			this.tooltips.hideTooltip();
			this.request = null;
			this.battlePaused = false;
			this.battle.reset();
			this.battle.play();
		},
		skipTurn: function () { this.battle.skipTurn(); },
		rewindTurn: function () { if (this.battle.turn) { this.battle.seekTurn(this.battle.turn - 1); } },
		goToEnd: function () { this.battle.seekTurn(Infinity); },
		register: function (userid) {
			var registered = app.user.get('registered');
			if (registered && registered.userid !== userid) registered = false;
			if (!registered && userid === app.user.get('userid')) { app.addPopup(RegisterPopup); }
		},
		closeAndMainMenu: function () {
			this.close();
			app.focusRoom('');
		},
		closeAndRematch: function () {
			app.once('response:fullformat', function (data) {
				app.rooms[''].requestNotifications();
				if (data) { app.rooms[''].challenge(this.battle.farSide.name, data); } 
				else { app.rooms[''].challenge(this.battle.farSide.name, this.battle.tier); }
				this.close();
				app.focusRoom('');
			}, this);
			app.send('/cmd fullformat ' + this.id);
		},
		//region Choice Buttons
		chooseGuard: function (e) {
			if (e) { e.preventDefault(); e.stopPropagation(); }
			if (!this.choice) return;
			this.tooltips.hideTooltip();
			this.choice.choices.push('guard');
			this.endChoice();
		},
		chooseMove: function (pos, el) {
			if (!this.choice) return;
			this.tooltips.hideTooltip();
			// pos === undefined if called by chooseMoveTarget()
			if (pos === undefined) {
				this.endChoice();
				return;
			}
			var nearActive = this.battle.nearSide.active;
			// Which active slot are we picking for right now?
			var choiceIndex = this.choice.choices.length;
			var isMegaArmed = (this.megaEvoArmedIndex === choiceIndex);
			var megaLetter = isMegaArmed ? this.megaEvoArmedLetter : null;
			var isUltraBurst = !!(this.$('input[name=ultraburst]')[0] || '').checked;
			var isTerastal = (this.terastallizeArmedIndex === choiceIndex);
			var isTeraEmpower = (this.teraEmpowerArmedIndex === choiceIndex);
			var target = 'normal';
			var moveId = '';
			if (el && el.getAttribute) {
				target = el.getAttribute('data-target') || 'normal';
				moveId = toID(el.getAttribute('data-move') || '');
			}
			var choosableTargets = { normal: 1, any: 1, adjacentAlly: 1, adjacentAllyOrSelf: 1, adjacentFoe: 1 };
			if (this.battle.gameType === 'freeforall') delete choosableTargets['adjacentAllyOrSelf'];
			// safety: never send both
			if (isTerastal) this.teraEmpowerArmedIndex = null;
			if (isTeraEmpower) this.terastallizeArmedIndex = null;
			var builtChoice =
			'move ' + pos +
			(megaLetter ? ' mega' + megaLetter.toLowerCase() : '') +
			(isUltraBurst ? ' ultra' : '') +
			(isTerastal ? ' terastallize' : '') +
			(isTeraEmpower ? ' teraempower' : '');
			console.log('CLIENT built move choice:', builtChoice, {
				choiceIndex: choiceIndex,
				isTeraEmpower: isTeraEmpower,
				isTerastal: isTerastal,
				teraEmpowerArmedIndex: this.teraEmpowerArmedIndex,
				terastallizeArmedIndex: this.terastallizeArmedIndex,
			});
			this.choice.choices.push(builtChoice);
			// consume arming for this slot
			this.terastallizeArmedIndex = null;
			this.teraEmpowerArmedIndex = null;
			this.megaEvoArmedIndex = null;
			this.megaEvoArmedLetter = null;
			// Targeting prompt (doubles/triples)
			if (nearActive.length > 1 && (target in choosableTargets)) {
				this.choice.type = 'movetarget';
				this.choice.moveTarget = target;
				this.updateControlsForPlayer();
				return false;
			}
			this.endChoice();
		},
		chooseMoveTarget: function (posString) {
			this.choice.choices[this.choice.choices.length - 1] += ' ' + posString;
			this.chooseMove();
		},
		chooseFight: function () {
			if (!this.choice) return;
			this.tooltips.hideTooltip();
			// TODO?: change this action
			this.choice.choices.push('testfight');
			this.endChoice();
		},
		chooseShift: function () {
			if (!this.choice) return;
			this.tooltips.hideTooltip();
			this.choice.choices.push('shift');
			this.endChoice();
		},
		chooseSwitch: function (pos) {
			if (!this.choice) return;
			this.tooltips.hideTooltip();
			if (this.battle.myPokemon[this.choice.choices.length].reviving) {
				this.choice.choices.push('switch ' + (parseInt(pos, 10) + 1));
				this.endChoice();
				return;
			}
			if (pos !== undefined) { // pos === undefined if called by chooseSwitchTarget()
				this.choice.switchFlags[pos] = true;
				if (this.choice.freedomDegrees >= 1) {
					// Request selection of a Pokémon that will be switched out.
					this.choice.type = 'switchposition';
					this.updateControlsForPlayer();
					return false;
				}
				// Default: left to right.
				this.choice.switchOutFlags[this.choice.choices.length] = true;
				this.choice.choices.push('switch ' + (parseInt(pos, 10) + 1));
				this.endChoice();
				return;
			}
			// After choosing the position to which a pokemon will switch in (Doubles/Triples end-game).
			if (!this.request || this.request.requestType !== 'switch') return false; // ??
			if (this.choice.canSwitch > _.filter(this.choice.choices, function (choice) { return choice; }).length) {
				// More switches are pending.
				this.choice.type = 'switch2';
				this.updateControlsForPlayer();
				return false;
			}
			this.endTurn();
		},
		chooseSwitchTarget: function (posString) {
			var slotSwitchIn = 0; // one-based
			for (var i in this.choice.switchFlags) {
				if (this.choice.choices.indexOf('switch ' + (+i + 1)) === -1) {
					slotSwitchIn = +i + 1;
					break;
				}
			}
			this.choice.choices[posString] = 'switch ' + slotSwitchIn;
			this.choice.switchOutFlags[posString] = true;
			this.chooseSwitch();
		},
		chooseTeamPreview: function (pos) {
			if (!this.choice) return;
			pos = parseInt(pos, 10);
			this.tooltips.hideTooltip();
			if (this.choice.count) {
				var temp = this.choice.teamPreview[pos];
				this.choice.teamPreview[pos] = this.choice.teamPreview[this.choice.done];
				this.choice.teamPreview[this.choice.done] = temp;
				this.choice.done++;
				if (this.choice.done < Math.min(this.choice.teamPreview.length, this.choice.count)) {
					this.choice.type = 'team2';
					this.updateControlsForPlayer();
					return false;
				}
			} else { this.choice.teamPreview = [pos + 1]; }
			this.endTurn();
		},
		chooseDisabled: function (data) {
			this.tooltips.hideTooltip();
			data = data.split(',');
			if (data[1] === 'fainted') { app.addPopupMessage("" + data[0] + " has no energy left to battle!"); } 
			else if (data[1] === 'notMine') { app.addPopupMessage("You cannot decide for your partner!"); } 
			else if (data[1] === 'trapped') { app.addPopupMessage("You are trapped and cannot select " + data[0] + "!"); } 
			else if (data[1] === 'active') { app.addPopupMessage("" + data[0] + " is already in battle!"); } 
			else if (data[1] === 'notfainted') { app.addPopupMessage("" + data[0] + " still has energy to battle!"); } 
			else { app.addPopupMessage("" + data[0] + " is already selected!"); }
		},
		endChoice: function () {
			var choiceIndex = this.choice.choices.length - 1;
			if (!this.nextChoice()) { this.endTurn(); } 
			else if (this.request.partial) { for (var i = choiceIndex; i < this.choice.choices.length; i++) { this.sendDecision(this.choice.choices[i]); } }
		},
		nextChoice: function () {
			var choices = this.choice.choices;
			var nearActive = this.battle.nearSide.active;
			if (this.request.requestType === 'switch' && this.request.forceSwitch !== true) {
				while (choices.length < this.battle.pokemonControlled && !this.request.forceSwitch[choices.length]) { choices.push('pass'); }
				if (choices.length < this.battle.pokemonControlled) {
					this.choice.type = 'switch2';
					this.updateControlsForPlayer();
					return true;
				}
			} else if (this.request.requestType === 'move') {
				var requestDetails = this.request && this.request.side ? this.battle.myPokemon : [];
				while (
					choices.length < this.battle.pokemonControlled &&
					(!nearActive[choices.length] || requestDetails[choices.length].commanding)
				) { choices.push('pass'); }
				if (choices.length < this.battle.pokemonControlled) {
					this.choice.type = 'move2';
					this.updateControlsForPlayer();
					return true;
				}
			}
			return false;
		},
		endTurn: function () {
			var act = this.request && this.request.requestType;
			if (act === 'team') {
				if (this.choice.teamPreview.length >= 10) { this.sendDecision('team ' + this.choice.teamPreview.join(',')); } 
				else { this.sendDecision('team ' + this.choice.teamPreview.join('')); }
			} else {
				if (act === 'switch') { // Assert that the remaining Pokémon won't switch, even though the player could have decided otherwise.
					for (var i = 0; i < this.battle.pokemonControlled; i++) { if (!this.choice.choices[i]) this.choice.choices[i] = 'pass'; }
				}
				if (this.choice.choices.length >= (this.choice.count || this.battle.pokemonControlled || this.request.active.length)) { this.sendDecision(this.choice.choices); }
				if (!this.finalDecision) {
					var lastChoice = this.choice.choices[this.choice.choices.length - 1];
					if (lastChoice.substr(0, 5) === 'move ' && this.finalDecisionMove) { this.finalDecisionMove = true; } 
					else if (lastChoice.substr(0, 7) === 'switch' && this.finalDecisionSwitch) { this.finalDecisionSwitch = true; }
				}
			}
			this.closeNotification('choice');
			this.choice.waiting = true;
			this.updateControlsForPlayer();
		},
		undoChoice: function (pos) {
			this.send('/undo');
			this.notifyRequest();
			this.clearChoice();
		},
		clearChoice: function () {
			this.choice = null;
			this.terastallizeArmedIndex = null;
			this.teraEmpowerArmedIndex = null;
			this.updateControlsForPlayer();
		},
		leaveBattle: function () {
			this.tooltips.hideTooltip();
			this.send('/leavebattle');
			this.side = '';
			this.closeNotification('choice');
		},
		selectSwitch: function () {
			this.tooltips.hideTooltip();
			this.$controls.find('.controls').attr('class', 'controls switch-controls');
		},
		selectMove: function () {
			this.tooltips.hideTooltip();
			this.$controls.find('.controls').attr('class', 'controls move-controls');
		}
	}, {
		readReplayFile: function (file) {
			var reader = new FileReader();
			reader.onload = function (e) {
				app.removeRoom('battle-uploadedreplay');
				var html = e.target.result;
				var titleStart = html.indexOf('<title>');
				var titleEnd = html.indexOf('</title>');
				var title = 'Uploaded Replay';
				if (titleStart >= 0 && titleEnd > titleStart) {
					title = html.slice(titleStart + 7, titleEnd - 1);
					var colonIndex = title.indexOf(':');
					var hyphenIndex = title.lastIndexOf('-');
					if (hyphenIndex > colonIndex + 2) { title = title.substring(colonIndex + 2, hyphenIndex - 1); } 
					else { title = title.substring(colonIndex + 2); }
				}
				var index1 = html.indexOf('<script type="text/plain" class="battle-log-data">');
				var index2 = html.indexOf('<script type="text/plain" class="log">');
				if (index1 < 0 && index2 < 0) return alert("Unrecognized HTML file: Only replay files are supported.");
				if (index1 >= 0) { html = html.slice(index1 + 50); } 
				else if (index2 >= 0) { html = html.slice(index2 + 38); }
				var index3 = html.indexOf('</script>');
				html = html.slice(0, index3);
				html = html.replace(/\\\//g, '/');
				app.receive('>battle-uploadedreplay\n|init|battle\n|title|' + title + '\n' + html);
				app.receive('>battle-uploadedreplay\n|expire|Uploaded replay');
			};
			reader.readAsText(file);
		}
	});
	var ForfeitPopup = this.ForfeitPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.gameType = data.gameType;
			var buf = '<form><p>';
			if (this.gameType === 'battle') { buf += 'Forfeiting makes you lose the battle.';	} 
			else if (this.gameType === 'help') { buf += 'Leaving the room will close the ticket.'; } 
			else if (this.gameType === 'room') { buf += 'Are you sure you want to exit this room?'; } 
			else { buf += 'Forfeiting makes you lose the game.'; }
			if (this.gameType === 'help') {
				buf += ' Are you sure?</p><p><label><input type="checkbox" name="closeroom" checked /> Close room</label></p>';
				buf += '<p><button type="submit" class="button"><strong>Close ticket</strong></button> ';
			} else if (this.gameType === 'room') { buf += ' </p><p><button type="submit" name="leaveRoom" class="button"><strong>Close room</strong></button>'; } 
			else {
				buf += ' Are you sure?</p><p><label class="checkbox"><input type="checkbox" name="closeroom" checked /> Close after forfeiting</label></p>';
				buf += '<p><button type="submit" class="button"><strong>Forfeit</strong></button> ';
			}
			if (this.gameType === 'battle' && this.room.battle && !this.room.battle.rated) { buf += '<button type="button" name="replacePlayer" class="button">Replace player</button> '; }
			buf += '<button type="button" name="close" class="button autofocus">Cancel</button></p></form>';
			this.$el.html(buf);
		},
		replacePlayer: function (data) {
			var room = this.room;
			var self = this;
			app.addPopupPrompt("Replacement player's username", "Replace player", function (target) {
				if (!target) return;
				var side = (room.battle.mySide.id === room.battle.p1.id ? 'p1' : 'p2');
				room.leaveBattle();
				room.send('/addplayer ' + target + ', ' + side);
				self.close();
			});
		},
		submit: function (data) {
			this.room.send('/forfeit');
			if (this.gameType === 'battle') this.room.battle.forfeitPending = true;
			if (this.$('input[name=closeroom]')[0].checked) { app.removeRoom(this.room.id); }
			this.close();
		},
		leaveRoom: function (data) {
			this.close();
			return app.removeRoom(this.room.id);
		}
	});
	var BattleOptionsPopup = this.BattleOptionsPopup = Popup.extend({
		initialize: function (data) {
			this.battle = data.battle;
			this.room = data.room;
			var rightPanelBattlesPossible = (MainMenuRoom.prototype.bestWidth + BattleRoom.prototype.minWidth < $(window).width());
			var buf = '<p><strong>In this battle</strong></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="hardcoremode"' + (this.battle.hardcoreMode ? ' checked' : '') + '/> Hardcore mode (hide info not shown in-game)</label></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="ignorespects"' + (this.battle.ignoreSpects ? ' checked' : '') + '/> Ignore spectators</label></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="ignoreopp"' + (this.battle.ignoreOpponent ? ' checked' : '') + '/> Ignore opponent</label></p>';
			buf += '<p><strong>All battles</strong></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="ignorenicks"' + (Dex.prefs('ignorenicks') ? ' checked' : '') + ' /> Ignore nicknames</label></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="allignorespects"' + (Dex.prefs('ignorespects') ? ' checked' : '') + '/> Ignore spectators</label></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="allignoreopp"' + (Dex.prefs('ignoreopp') ? ' checked' : '') + '/> Ignore opponent</label></p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="autotimer"' + (Dex.prefs('autotimer') ? ' checked' : '') + '/> Automatically start timer</label></p>';
			if (rightPanelBattlesPossible) buf += '<p><label class="checkbox"><input type="checkbox" name="rightpanelbattles"' + (Dex.prefs('rightpanelbattles') ? ' checked' : '') + ' /> Open new battles on the right side</label></p>';
			buf += '<p><button name="close" class="button">Done</button></p>';
			this.$el.html(buf);
		},
		events: {
			'change input[name=ignorespects]': 'toggleIgnoreSpects',
			'change input[name=ignorenicks]': 'toggleIgnoreNicks',
			'change input[name=ignoreopp]': 'toggleIgnoreOpponent',
			'change input[name=hardcoremode]': 'toggleHardcoreMode',
			'change input[name=allignorespects]': 'toggleAllIgnoreSpects',
			'change input[name=allignoreopp]': 'toggleAllIgnoreOpponent',
			'change input[name=autotimer]': 'toggleAutoTimer',
			'change input[name=rightpanelbattles]': 'toggleRightPanelBattles'
		},
		toggleHardcoreMode: function (e) {
			this.room.setHardcoreMode(!!e.currentTarget.checked);
			if (this.battle.hardcoreMode) { this.battle.add('Hardcore mode ON: Information not available in-game is now hidden.'); } 
			else { this.battle.add('Hardcore mode OFF: Information not available in-game is now shown.'); }
		},
		toggleIgnoreSpects: function (e) {
			this.battle.ignoreSpects = !!e.currentTarget.checked;
			this.battle.add('Spectators ' + (this.battle.ignoreSpects ? '' : 'no longer ') + 'ignored.');
			var $messages = $('.battle-log').find('.chat').has('small').not(':contains(\u2605), :contains(\u2606)');
			if (!$messages.length) return;
			if (this.battle.ignoreSpects) { $messages.hide(); } 
			else { $messages.show(); }
		},
		toggleAllIgnoreSpects: function (e) {
			var ignoreSpects = !!e.currentTarget.checked;
			Storage.prefs('ignorespects', ignoreSpects);
			if (ignoreSpects && !this.battle.ignoreSpects) this.$el.find('input[name=ignorespects]').click();
		},
		toggleIgnoreNicks: function (e) {
			this.battle.ignoreNicks = !!e.currentTarget.checked;
			Storage.prefs('ignorenicks', this.battle.ignoreNicks);
			this.battle.add('Nicknames ' + (this.battle.ignoreNicks ? '' : 'no longer ') + 'ignored.');
			this.battle.resetToCurrentTurn();
		},
		toggleIgnoreOpponent: function (e) {
			this.battle.ignoreOpponent = !!e.currentTarget.checked;
			this.battle.add('Opponent ' + (this.battle.ignoreOpponent ? '' : 'no longer ') + 'ignored.');
			this.battle.resetToCurrentTurn();
		},
		toggleAllIgnoreOpponent: function (e) {
			var ignoreOpponent = !!e.currentTarget.checked;
			Storage.prefs('ignoreopp', ignoreOpponent);
			if (ignoreOpponent && !this.battle.ignoreOpponent) this.$el.find('input[name=ignoreopp]').click();
		},
		toggleAutoTimer: function (e) {
			var autoTimer = !!e.currentTarget.checked;
			Storage.prefs('autotimer', autoTimer);
			if (autoTimer) {
				this.room.setTimer('on');
				this.room.autoTimerActivated = true;
			}
		},
		toggleRightPanelBattles: function (e) { Storage.prefs('rightpanelbattles', !!e.currentTarget.checked); }
	});
	var TimerPopup = this.TimerPopup = Popup.extend({
		initialize: function (data) {
			this.room = data.room;
			if (this.room.battle.kickingInactive) { this.$el.html('<p><button name="timerOff"><strong>Stop timer</strong></button></p>'); } 
			else { this.$el.html('<p><button name="timerOn"><strong>Start timer</strong></button></p>'); }
		},
		timerOff: function () {
			this.room.setTimer('off');
			this.close();
		},
		timerOn: function () {
			this.room.setTimer('on');
			this.close();
		}
	});
}).call(this, jQuery);