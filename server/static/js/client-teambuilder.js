(function (exports, $) {
	// this is a useful global
	var teams;
	//region Affinity/Aversion
	exports.TypeAffinityAversion = {
		bug: {
			affinity: { binding: 5, bite: 5, claw: 5, dance: 5, drain: 5, sound: 5 },
			aversion: { aura: 6, beam: 6, kick: 6 }
		},
		dark: {
			affinity: { aura: 5, magic: 5, pulse: 5, shadow: 5, weapon: 5 },
			aversion: { beam: 6, heal: 6, light: 6, solar: 6 }
		},
		dragon: {
			affinity: { aura: 5, bite: 5, bomb: 5, breath: 5, bullet: 5, claw: 5, magic: 5 },
			aversion: { kick: 6, lunar: 6, weapon: 6 }
		},
		electric: {
			affinity: { beam: 5, explosive: 5, drain: 5, light: 5, pulse: 5, sound: 5 },
			aversion: { bomb: 6, powder: 6, slice: 6 }
		},
		fairy: {
			affinity: { heal: 5, lunar: 5, magic: 5, wing: 5 },
			aversion: { beam: 6, bite: 6, breath: 6, claw: 6, crash: 6, shadow: 6, solar: 6 }
		},
		fighting: {
			affinity: { aura: 5, binding: 5, dance: 5, kick: 5, punch: 5, sweep: 5, throw: 5 },
			aversion: { bite: 6, magic: 6, weapon: 6 }
		},
		fire: {
			affinity: { aura: 5, bomb: 5, breath: 5, explosive: 5, light: 5, wind: 5 },
			aversion: { airborne: 6, beam: 6, crash: 6, pierce: 6, pulse: 6, shadow: 6, spin: 6, weapon: 6 }
		},
		flying: {
			affinity: { airborne: 5, bomb: 5, claw: 5, pierce: 5, wind: 5, wing: 5 },
			aversion: { binding: 6, crush: 6, kick: 6, punch: 6, sweep: 6, weapon: 6 }
		},
		ghost: {
			affinity: { airborne: 5, magic: 5, shadow: 5, weapon: 5, wind: 5 },
			aversion: { aura: 6, contact: 6, crash: 6, drain: 6, explosive: 6, heal: 6, pierce: 6, pulse: 6 }
		},
		grass: {
			affinity: { aura: 5, drain: 5, heal: 5, pierce: 5, solar: 5 },
			aversion: { bite: 6, claw: 6, spin: 6, weapon: 6 }
		},
		ground: {
			affinity: { binding: 5, drain: 5, kick: 5, spin: 5 },
			aversion: { airborne: 6, spin: 6, throw: 6, wind: 6, wing: 6 }
		},
		ice: {
			affinity: { beam: 5, light: 5, pierce: 5, spin: 5 },
			aversion: { slice: 6, weapon: 6 }
		},
		normal: {
			affinity: { contact: 5, heal: 5, sound: 5, weapon: 5 },
			aversion: { aura: 6, dance: 6, kick: 6, magic: 6, punch: 6, shadow: 6 }
		},
		poison: {
			affinity: { binding: 5, breath: 5, contact: 5, drain: 5, explosive: 5 },
			aversion: { heal: 6 }
		},
		psychic: {
			affinity: { aura: 5, beam: 5, binding: 5, explosive: 5, heal: 5, light: 5, pulse: 5, throw: 5, weapon: 5 },
			aversion: { dance: 6, kick: 6, punch: 6, sweep: 6 }
		},
		rock: {
			affinity: { airborne: 5, binding: 5, bomb: 5, bullet: 5, crash: 5, crush: 5, magic: 5, spin: 5, throw: 5, weapon: 5 },
			aversion: { aura: 6, bite: 6, dance: 6, pierce: 6 }
		},
		steel: {
			affinity: { beam: 5, bullet: 5, crash: 5, crush: 5, pierce: 5, slice: 5, weapon: 5 },
			aversion: { aura: 6, dance: 6, explosive: 6, heal: 6, magic: 6, pulse: 6 }
		},
		stellar: {
			affinity: { aura: 5, beam: 5, light: 5, lunar: 5, magic: 5, solar: 5, spin: 5 },
			aversion: {}
		},
		water: {
			affinity: { beam: 5, bomb: 5, heal: 5, magic: 5, wind: 5 },
			aversion: { breath: 6, crash: 6, drain: 6, explosive: 6, pierce: 6, slice: 6, weapon: 6 }
		}	
	};
	var TypeAffinityAversion = exports.TypeAffinityAversion;
	//region IS Type Overrides
	var IndigoStarstormTypes = {
		flygon: ["Bug", "Dragon"]
	};
	
	exports.TeambuilderRoom = exports.Room.extend({
		type: 'teambuilder',
		title: 'Teambuilder',
		bestWidth: 870,
		minWidth: 870,
		maxWidth: 870,
		initialize: function () {
			teams = Storage.teams;
			// left menu
			this.$el.addClass('ps-room-light').addClass('scrollable');
			if (!Storage.whenTeamsLoaded.isLoaded) { Storage.whenTeamsLoaded(this.update, this); }
			this.update();
			if (typeof Storage.prefs('uploadprivacy') !== 'undefined') { this.$('input[name=teamprivacy]').is('checked', Storage.prefs('uploadprivacy')); }
		},
		focus: function () {
			if (this.curTeam) {
				this.curTeam.iconCache = '!';
				this.curTeam.gen = this.getGen(this.curTeam.format);
				this.curTeam.dex = Dex.forGen(this.curTeam.gen);
				if (this.curTeam.format.includes('letsgo')) { this.curTeam.dex = Dex.mod('gen7letsgo'); }
				if (this.curTeam.format.includes('bdsp')) { this.curTeam.dex = Dex.mod('gen8bdsp'); }
				if (this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.includes('isl')) { this.curTeam.dex = Dex.mod('gen9indigostarstorm'); }
				Storage.activeSetList = this.curSetList;
			}
		},
		blur: function () {
			if (this.saveFlag) {
				this.saveFlag = false;
				app.user.trigger('saveteams');
			}
		},
		events: {
			// team changes
			'change input.teamnameedit': 'teamNameChange',
			'click button.formatselect': 'selectFormat',
			'change input[name=nickname]': 'nicknameChange',
			// misc
			'click input[name=teamprivacy]': 'privacyChange',
			// details
			'change .detailsform input': 'detailsChange',
			'change .detailsform input': 'detailsChange',
			'change .detailsform select': 'detailsChange',
			'submit .detailsform': 'detailsChange',
			'blur .detailsform input[type=number]': 'detailsChange',
			'change input[name=level]': 'detailsChange',
			'blur input[name=level]': 'detailsChange',
			'change input[name=happiness]': 'detailsChange',
			'blur input[name=happiness]': 'detailsChange',
			'change select[name=size]': 'sizeChange',
			'change input.shiny-checkbox': 'shinyChange',
			'click button[name=altform]': 'altForm',
			'click .altform': 'altForm',
			'click button.teratype': 'teraTypeSelect',
			'click button[name=formeToggle]': 'formeToggleSelect',
			'click button[name=genderToggle]': 'genderToggleChange',
			// stats
			'keyup .statform input.numform': 'statChange',
			'input .statform input[type=number].numform': 'statChange',
			'change select[name=nature]': 'natureChange',
			'change .evslider': 'statSlided',
			'input .evslider': 'statSlide',
			// ability set
			'click button[name=abilitySetToggle]': 'abilitySetChange',
			// affinity/aversion
			'click .affinity-flag-icon': 'affinityFlagClick',
			'click .aversion-flag-icon': 'aversionFlagClick',
			// teambuilder events
			'click .utilichart a': 'chartClick',
			'keydown .chartinput': 'chartKeydown',
			'keyup .chartinput': 'chartKeyup',
			'focus .chartinput': 'chartFocus',
			'blur .chartinput': 'chartChange',
			'keyup .searchinput': 'searchChange',
			// drag/drop
			'click .team': 'edit',
			'click .selectFolder': 'selectFolder',
			'mouseover .team': 'mouseOverTeam',
			'mouseout .team': 'mouseOutTeam',
			'dragstart .team': 'dragStartTeam',
			'dragend .team': 'dragEndTeam',
			'dragenter .team': 'dragEnterTeam',
			'dragenter .folder .selectFolder': 'dragEnterFolder',
			'dragleave .folder .selectFolder': 'dragLeaveFolder',
			'dragexit .folder .selectFolder': 'dragExitFolder',
			// clipboard
			'click .teambuilder-clipboard-data .result': 'clipboardResultSelect',
			'click .teambuilder-clipboard-data': 'clipboardExpand',
			'blur .teambuilder-clipboard-data': 'clipboardShrink'
		},
		dispatchClick: function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (this[e.currentTarget.value]) this[e.currentTarget.value](e);
		},
		back: function () {
			if (this.exportMode) { if (this.curTeam) {
					this.curTeam.team = Storage.packTeam(this.curSetList);
					Storage.saveTeam(this.curTeam);
				}
				this.exportMode = false;
			} else if (this.curSet) {
				this.curSet = null;
				Storage.saveTeam(this.curTeam);
			} else if (this.curTeam) {
				this.clearCachedUserSetsIfNecessary(this.curTeam.format);
				this.curTeam.team = Storage.packTeam(this.curSetList);
				this.curTeam.iconCache = '';
				var team = this.curTeam;
				this.curTeam = null;
				Storage.activeSetList = this.curSetList = null;
				Storage.saveTeam(team);
			} else { return; }
			app.user.trigger('saveteams');
			this.update();
		},
		// the teambuilder has three views:
		// - team list (curTeam falsy)
		// - team view (curTeam exists, curSet falsy)
		// - set view (curTeam exists, curSet exists)
		curTeam: null,
		curTeamLoc: 0,
		curSet: null,
		curSetLoc: 0,
		// curFolder will have '/' at the end if it's a folder, but
		// it will be alphanumeric (so guaranteed no '/') if it's a
		// format
		// Special values:
		// '' -     show all
		// 'gen9' - show teams with no format
		// '/' -    show teams with no folder
		curFolder: '',
		curFolderKeep: '',
		curSearchVal: '',
		// Debounce value for searching in the teambuilder
		searchTimeout: null,
		exportMode: false,
		formatResources: {},
		update: function () {
			teams = Storage.teams;
			if (this.curTeam) {
				if (this.curTeam.format && !this.formatResources[this.curTeam.format]) { this.tryLoadFormatResource(this.curTeam.format); }
				if (this.curTeam.loaded === false || (this.curTeam.teamid && !this.curTeam.loaded)) { this.loadTeam();
				return this.updateTeamView();
				}
				this.ignoreEVLimits = (this.curTeam.gen < 3 || ((this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh')) && this.curTeam.gen !== 6) || this.curTeam.format.includes('metronomebattle'));
				if (this.curSet) { return this.updateSetView(); }
				return this.updateTeamView();
			}
			return this.updateTeamInterface();
		},
		privacyChange: function (ev) { Storage.prefs('uploadprivacy', ev.currentTarget.checked); },
		loadTeam: function () {
			if (this.loadingTeam) return false;
			this.loadingTeam = true;
			var teambuilder = this;
			app.loadTeam(this.curTeam, function (team) {
				window.builderTeam = team;
				teambuilder.loadingTeam = false;
				teambuilder.curSetList = Storage.unpackTeam(team.team);
				for (var k = 0; k < teambuilder.curSetList.length; k++) {
					var s = teambuilder.curSetList[k];
					if (!s || !s.species) continue;
					var dex = teambuilder.curTeam.dex || Dex;
					var sp = dex.species.get(s.species);
					var ab = sp.abilities || {};
					var as = (s.abilitySet === 2 ? 2 : 1);
					if (as === 2) {
    					s.ability = ab.H || '';
    					s.ability2 = ab.S || '';
    					if (!s.ability && !s.ability2) { // fallback if set 2 doesn't exist
    						s.abilitySet = 1;
    						s.ability = ab['0'] || '';
    						s.ability2 = ab['1'] || '';
    					}
  					} else {
    					s.abilitySet = 1;
    					s.ability = ab['0'] || '';
    					s.ability2 = ab['1'] || '';
  					}
				}
				Storage.activeSetList = teambuilder.curSetList;
				teambuilder.curTeam.team = Storage.packTeam(teambuilder.curSetList);
				teambuilder.updateTeamView();
			});
		},
		tryLoadFormatResource: function (format) {
			var teambuilder = this;
			if (format in teambuilder.formatResources) { // already loading, bypass
				return;
			}
			teambuilder.formatResources[format] = true; // true - loading, array - loaded
			$.get('https://www.smogon.com/dex/api/formats/by-ps-name/' + format, {}, function (data) { // if the data doesn't exist, set it to true so it stops trying to load it
				teambuilder.formatResources[format] = data || true;
				teambuilder.update();
			});
		},
		//region Team list view
		deletedTeam: null,
		deletedTeamLoc: -1,
		updateTeamInterface: function () {
			this.deletedSet = null;
			this.deletedSetLoc = -1;
			var buf = '';
			if (this.exportMode) {
				if (this.curFolder) {
					buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button></div>';
					buf += '<div class="teamedit"><textarea readonly class="textbox" rows="17">' + BattleLog.escapeHTML(Storage.exportFolder(this.curFolder)) + '</textarea></div>';
				} else {
					buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> <button name="saveBackup" class="savebutton button"><i class="fa fa-floppy-o"></i> Save</button></div>';
					buf += '<div class="teamedit"><textarea class="textbox" rows="17">';
					if (Storage.teams.length > 350) { buf += BattleLog.escapeHTML(Storage.getPackedTeams()); } 
					else { buf += BattleLog.escapeHTML(Storage.exportAllTeams()); }
					buf += '</textarea></div>';
				}
				this.$el.html(buf);
				this.$('.teamedit textarea').focus().select();
				return;
			}
			if (!Storage.whenTeamsLoaded.isLoaded) {
				if (Storage.whenTeamsLoaded.error === 'stalled') {
					buf = '<div class="pad"><p class="message-error">We\'re having some trouble loading teams securely.</p>';
					buf += '<p>This is sometimes caused by antiviruses like Avast and BitDefender.</p>';
					buf += '<p><strong>If you\'re using Firefox and an antivirus:</strong> Your antivirus is trying to scan your teams, and a recent Firefox update doesn\'t let it. Turn off HTTPS scanning in your antivirus or uninstall your antivirus, and your teams will come back.</p>';
					buf += '<p>You can use the teambuilder insecurely, but any teams you\'ve saved securely won\'t be there.</p>';
					buf += '<p><button class="button" name="insecureUse">Use teambuilder insecurely</button></p></div>';
				} else if (Storage.whenTeamsLoaded.error) {
					buf = '<div class="pad"><p class="message-error">We got an error trying to load teams: ' + Storage.whenTeamsLoaded.error.message + '.</p>';
					buf += '<p>This might be because you didn\'t give us permission to load teams: on macOS, this is in System Preferences → Security &amp; Privacy → Privacy → Files and Folders → Pokemon Showdown</p></div>';
				} else {
					buf = '<div class="pad"><p>lol zarel this is a horrible teambuilder</p>';
					buf += '<p>that\'s because we\'re not done loading it...</p></div>';
				}
				this.$el.html(buf);
				return;
			}
			// folderpane
			buf = '<div class="folderpane">';
			buf += '</div>';
			// teampane
			buf += '<div class="teampane">';
			buf += '</div>';
			this.$el.html(buf);
			this.updateFolderList();
			this.updateTeamList();
		},
		insecureUse: function () {
			Storage.whenTeamsLoaded.load();
			this.updateTeamInterface();
		},
		updateFolderList: function () {
			var buf = '<div class="folderlist"><div class="folderlistbefore"></div>';
			buf += '<div class="folder' + (!this.curFolder ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="all"><em>(all)</em></div></div>' + (!this.curFolder ? '</div>' : '');
			var folderTable = {};
			var folders = [];
			if (Storage.teams) for (var i = -2; i < Storage.teams.length; i++) {
				if (i >= 0) {
					var folder = Storage.teams[i].folder;
					if (folder && !((folder + '/') in folderTable)) {
						folders.push('Z' + folder);
						folderTable[folder + '/'] = 1;
						if (!('/' in folderTable)) {
							folders.push('Z~');
							folderTable['/'] = 1;
						}
					}
				}
				var format;
				if (i === -2) { format = this.curFolderKeep; } 
				else if (i === -1) { format = this.curFolder; } 
				else {
					format = Storage.teams[i].format;
					if (!format) format = 'gen9';
				}
				if (!format) continue;
				if (format in folderTable) continue;
				folderTable[format] = 1;
				if (format.slice(-1) === '/') {
					folders.push('Z' + (format.slice(0, -1) || '~'));
					if (!('/' in folderTable)) {
						folders.push('Z~');
						folderTable['/'] = 1;
					}
					continue;
				}
				if (format === 'gen9') {
					folders.push('A~');
					continue;
				}
				switch (format.slice(0, 4)) {
				case 'gen1': format = 'I' + format.slice(4); break;
				case 'gen2': format = 'H' + format.slice(4); break;
				case 'gen3': format = 'G' + format.slice(4); break;
				case 'gen4': format = 'F' + format.slice(4); break;
				case 'gen5': format = 'E' + format.slice(4); break;
				case 'gen6': format = 'D' + format.slice(4); break;
				case 'gen7': format = 'C' + format.slice(4); break;
				case 'gen8': format = 'B' + format.slice(4); break;
				case 'gen9': format = 'A' + format.slice(4); break;
				default: format = 'X' + format; break;
				}
				folders.push(format);
			}
			folders.sort();
			var gen = '';
			var formatFolderBuf = '<div class="foldersep"></div>';
			formatFolderBuf += '<div class="folder"><div class="selectFolder" data-value="+"><i class="fa fa-plus"></i><em>(add format folder)</em></div></div>';
			for (var i = 0; i < folders.length; i++) {
				var format = folders[i];
				var newGen;
				switch (format.charAt(0)) {
				case 'I': newGen = '1'; break;
				case 'H': newGen = '2'; break;
				case 'G': newGen = '3'; break;
				case 'F': newGen = '4'; break;
				case 'E': newGen = '5'; break;
				case 'D': newGen = '6'; break;
				case 'C': newGen = '7'; break;
				case 'B': newGen = '8'; break;
				case 'A': newGen = '9'; break;
				case 'X': newGen = 'X'; break;
				case 'Z': newGen = '/'; break;
				}
				if (gen !== newGen) {
					gen = newGen;
					if (gen === '/') {
						buf += formatFolderBuf;
						formatFolderBuf = '';
						buf += '<div class="foldersep"></div>';
						buf += '<div class="folder"><h3>Folders</h3></div>';
					} else if (gen === 'X') { buf += '<div class="folder"><h3>???</h3></div>'; } 
					else { buf += '<div class="folder"><h3>Gen ' + gen + '</h3></div>'; }
				}
				var formatName;
				if (gen === '/') {
					formatName = format.slice(1);
					format = formatName + '/';
					if (formatName === '~') {
						formatName = '(uncategorized)';
						format = '/';
					} else { formatName = BattleLog.escapeHTML(formatName); }
					buf += '<div class="folder' + (this.curFolder === format ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="' + format + '"><i class="fa ' + (this.curFolder === format ? 'fa-folder-open' : 'fa-folder') + (format === '/' ? '-o' : '') + '"></i>' + formatName + '</div></div>' + (this.curFolder === format ? '</div>' : '');
					continue;
				}
				formatName = format.slice(1);
				if (formatName === '~') formatName = '';
				format = 'gen' + newGen + formatName;
				if (format.length === 4) formatName = '(uncategorized)';
				// folders are <div>s rather than <button>s because in theory it has
				// less weird interactions with HTML5 drag-and-drop
				buf += '<div class="folder' + (this.curFolder === format ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="' + format + '"><i class="fa ' + (this.curFolder === format ? 'fa-folder-open-o' : 'fa-folder-o') + '"></i>' + formatName + '</div></div>' + (this.curFolder === format ? '</div>' : '');
			}
			buf += formatFolderBuf;
			buf += '<div class="foldersep"></div>';
			buf += '<div class="folder"><div class="selectFolder" data-value="++"><i class="fa fa-plus"></i><em>(add folder)</em></div></div>';
			buf += '<div class="folderlistafter"></div></div>';
			this.$('.folderpane').html(buf);
		},
		updateTeamList: function (resetScroll) {
			var teams = Storage.teams;
			var buf = '';
			// teampane
			buf += this.clipboardHTML();
			var filterFormat = '';
			// filterFolder === undefined: show teams in any folder
			// filterFolder === '': show only teams that don't have a folder
			var filterFolder;
			if (!this.curFolder) {
				buf += '<h2>Hi</h2>';
				buf += '<p>Did you have a good day?</p>';
				buf += '<p><button class="button" name="greeting" value="Y"><i class="fa fa-smile-o"></i> Yes, my day was pretty good</button> <button class="button" name="greeting" value="N"><i class="fa fa-frown-o"></i> No, it wasn\'t great</button></p>';
				buf += '<h2>All teams <small style="font-weight: normal">(' + teams.length + ')</small></h2>';
			} else {
				if (this.curFolder.slice(-1) === '/') {
					filterFolder = this.curFolder.slice(0, -1);
					if (filterFolder) { buf += '<h2><i class="fa fa-folder-open"></i> ' + filterFolder + ' <button class="button small" style="margin-left:5px" name="renameFolder"><i class="fa fa-pencil"></i> Rename</button> <button class="button small" style="margin-left:5px" name="promptDeleteFolder"><i class="fa fa-times"></i> Remove</button></h2>'; } 
					else { buf += '<h2><i class="fa fa-folder-open-o"></i> Teams not in any folders</h2>'; }
				} else {
					filterFormat = this.curFolder;
					var func = function (team) { return team.format === filterFormat; };
					buf += '<h2><i class="fa fa-folder-open-o"></i> ' + filterFormat + ' <small style="font-weight: normal">(' + teams.filter(func).length + ')</small></h2>';
				}
			}
			var newTeamButtonText = "New Team";
			if (filterFolder) newTeamButtonText = "New Team in folder";
			if (filterFormat && filterFormat !== 'gen9') { newTeamButtonText = "New " + BattleLog.escapeFormat(filterFormat) + " Team"; }
			buf += '<p><button name="newTop" value="team" class="button big"><i class="fa fa-plus-circle"></i> ' + newTeamButtonText + '</button> ' +
				'<button name="newTop" value="box" class="button big"><i class="fa fa-archive"></i> New Box</button> ' +
				'<input type="text" id="teamSearchBar" name="search" class="textbox searchinput" value="' + this.curSearchVal + '" placeholder="search teams"/></p>';
			buf += '<ul class="teamlist">';
			var atLeastOne = false;
			try { if (!window.localStorage && !window.nodewebkit) buf += '<li>== CAN\'T SAVE ==<br /><small>Your browser doesn\'t support <code>localStorage</code> and can\'t save teams! Update to a newer browser.</small></li>'; } 
			catch (e) { buf += '<li>== CAN\'T SAVE ==<br /><small><code>Cookies</code> are disabled so you can\'t save teams! Enable them in your browser settings.</small></li>'; }
			if (Storage.cantSave) buf += '<li>== CAN\'T SAVE ==<br /><small>You hit your browser\'s limit for team storage! Please backup them and delete some of them. Your teams won\'t be saved until you\'re under the limit again.</small></li>';
			if (!teams.length) {
				if (this.deletedTeamLoc >= 0) { buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>'; }
				buf += '<li><p><em>you don\'t have any teams lol</em></p></li>';
			} else { for (var i = 0; i < teams.length + 1; i++) { if (i === this.deletedTeamLoc) {
						if (!atLeastOne) atLeastOne = true;
						buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>';
					}
					if (i >= teams.length) break;
					var team = teams[i];
					if (team && !team.team && team.team !== '') { team = null; }
					if (!team) {
						buf += '<li>Error: A corrupted team was dropped</li>';
						teams.splice(i, 1);
						i--;
						if (this.deletedTeamLoc && this.deletedTeamLoc > i) this.deletedTeamLoc--;
						continue;
					}
					if (filterFormat && filterFormat !== (team.format || 'gen9')) continue;
					if (filterFolder !== undefined && filterFolder !== team.folder) continue;
					if (this.curSearchVal) {
						// If a Pokemon hasn't been given a nickname, species is omitted
						// from the packed team.team in favor of the name field
						// since the name defaults to the species' display name.
						// While eliminating this redundancy between name and species
						// helps with packed team size, the display name unfortunately
						// won't match the ID search term and so we need to special case
						// searching for Pokemon here
						var pokemon = team.team.split(']').map(function (el) { return toID(PSUtils.splitFirst(el, '|')[0]); });
						var searchVal = this.curSearchVal.split(',').map(function (el) { return toID(el); });
						var meetsCriteria = searchVal.every(function (el) { return team.team.indexOf(el) > -1 || pokemon.includes(el); });
						if (!meetsCriteria) continue;
					}
					if (!atLeastOne) atLeastOne = true;
					var formatText = '';
					if (team.format) { formatText = '[' + team.format + '] '; }
					if (team.folder) formatText += team.folder + '/';
					// teams and boxes are <div>s rather than <button>s because Firefox doesn't support dragging and dropping buttons.
					buf += '<li><div name="edit" data-value="' + i + '" class="team';
					if (team.capacity === 24) buf += ' pc-box';
					buf += '" draggable="true">' + BattleLog.escapeHTML(formatText) + '<strong>' + BattleLog.escapeHTML(team.name) + '</strong><br /><small>';
					buf += Storage.getTeamIcons(team);
					buf += '</small></div><button name="edit" value="' + i + '"><i class="fa fa-pencil" aria-label="Edit" title="Edit (you can also just click on the team)"></i></button><button name="duplicate" value="' + i + '" title="Duplicate" aria-label="Duplicate"><i class="fa fa-clone"></i></button><button name="delete" value="' + i + '"><i class="fa fa-trash"></i> Delete</button></li>';
				}
				if (!atLeastOne) {
					if (filterFolder) { buf += '<li><p><em>you don\'t have any teams in this folder lol</em></p></li>'; } 
					else { buf += '<li><p><em>you don\'t have any ' + this.curFolder + ' teams lol</em></p></li>'; }
				}
			}
			buf += '</ul><p>';
			if (atLeastOne) { buf += '<button name="new" value="team" class="button"><i class="fa fa-plus-circle"></i> ' + newTeamButtonText + '</button> <button name="new" value="box" class="button"><i class="fa fa-archive"></i> New Box</button> '; }
			buf += '<button class="button" name="send" value="/teams">View teams uploaded to server</button>';
			buf += '</p>';
			if (window.nodewebkit) { buf += '<button name="revealFolder" class="button"><i class="fa fa-folder-open"></i> Reveal teams folder</button> <button name="reloadTeamsFolder" class="button"><i class="fa fa-refresh"></i> Reload teams files</button> <button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>'; } 
			else if (this.curFolder) { buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup all teams from this folder</button>'; } 
			else if (atLeastOne) {
				buf += '<p><strong>Clearing your cookies (specifically, <code>localStorage</code>) will delete your teams.</strong> ';
				buf += '<span class="storage-warning">Browsers sometimes randomly clear cookies - you should upload your teams to the Showdown database ';
				buf += 'or make a backup yourself if you want to make sure you don\'t lose them.</span></p>';
				buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>';
				buf += '<p>If you want to clear your cookies or <code>localStorage</code>, you can use the Backup/Restore feature to save your teams as text first.</p>';
				var self = this;
				if (navigator.storage && navigator.storage.persisted) { navigator.storage.persisted().then(function (state) { self.updatePersistence(state); }); }
			} else { buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Restore teams from backup</button>'; }
			var $pane = this.$('.teampane');
			$pane.html(buf);
			if (resetScroll) { $pane.scrollTop(0); } 
			else if (this.teamScrollPos) {
				$pane.scrollTop(this.teamScrollPos);
				this.teamScrollPos = 0;
			}
			// reset focus to searchbar
			var teamSearchBar = this.$("#teamSearchBar");
			var strLength = teamSearchBar.val().length;
			if (strLength) {
				teamSearchBar.focus();
				teamSearchBar[0].setSelectionRange(strLength, strLength);
			}
		},
		updatePersistence: function (state) { if (state) { this.$('.storage-warning').html(''); } },
		greeting: function (answer, button) {
			var buf = '<p><strong>' + $(button).html() + '</p></strong>';
			if (answer === 'N') { buf += '<p>Aww, that\'s too bad. :( I hope playing on Pok&eacute;mon Showdown today can help cheer you up!</p>'; }
			 else if (answer === 'Y') {
				buf += '<p>Cool! I just added some pretty cool teambuilder features, so I\'m pretty happy, too. Did you know you can drag and drop teams to different format-folders? You can also drag and drop them to and from your computer (works best in Chrome).</p>';
				buf += '<p><button class="button" name="greeting" value="W"><i class="fa fa-question-circle"></i> Wait, who are you? Talking to a teambuilder is weird.</button></p>';
			} else if (answer === 'W') {
				buf += '<p>Oh, I\'m Zarel! I made a Credits button for this...</p>';
				buf += '<div class="menugroup"><p><a href="//pokemonshowdown.com/credits" target="_blank"><button class="button mainmenu4"><i class="fa fa-info-circle"></i> Credits</button></a></p></div>';
				buf += '<p>Isn\'t it pretty? Matches your background and everything. It used to be in the Main Menu but we had to get rid of it to save space.</p>';
				buf += '<p>Speaking of, you should try <button class="button" name="background"><i class="fa fa-picture-o"></i> changing your background</button>.';
				buf += '<p><button class="button" name="greeting" value="B"><i class="fa fa-hand-pointer-o"></i> You might be having too much fun with these buttons and icons</button></p>';
			} else if (answer === 'B') {
				buf += '<p>I paid good money for those icons! I need to get my money\'s worth!</p>';
				buf += '<p><button class="button" name="greeting" value="WR"><i class="fa fa-exclamation-triangle"></i> Wait, really?</button></p>';
			} else if (answer === 'WR') {
				buf += '<p>No, they were free. That just makes it easier to get my money\'s worth. Let\'s play rock paper scissors!</p>';
				buf += '<p><button class="button" name="greeting" value="RR"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="RP"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="RS"><i class="fa fa-hand-scissors-o"></i> Scissors</button> <button class="button" name="greeting" value="RL"><i class="fa fa-hand-lizard-o"></i> Lizard</button> <button class="button" name="greeting" value="RK"><i class="fa fa-hand-spock-o"></i> Spock</button></p>';
			} else if (answer[0] === 'R') {
				buf += '<p>I play laser, I win. <i class="fa fa-hand-o-left"></i></p>';
				buf += '<p><button class="button" name="greeting" value="YC"><i class="fa fa-thumbs-o-down"></i> You can\'t do that!</button></p>';
			} else if (answer === 'SP') {
				buf += '<p>Okay, sure. I warn you, I\'m using the same RNG that makes Stone Edge miss for you.</p>';
				buf += '<p><button class="button" name="greeting" value="SP3"><i class="fa fa-caret-square-o-right"></i> I want to play Rock Paper Scissors</button> <button class="button" name="greeting" value="SP5"><i class="fa fa-caret-square-o-right"></i> I want to play Rock Paper Scissors Lizard Spock</button></p>';
			} else if (answer === 'SP3') { buf += '<p><button class="button" name="greeting" value="PR3"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="PP3"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="PS3"><i class="fa fa-hand-scissors-o"></i> Scissors</button></p>'; } 
			else if (answer === 'SP5') { buf += '<p><button class="button" name="greeting" value="PR5"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="PP5"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="PS5"><i class="fa fa-hand-scissors-o"></i> Scissors</button> <button class="button" name="greeting" value="PL5"><i class="fa fa-hand-lizard-o"></i> Lizard</button> <button class="button" name="greeting" value="PK5"><i class="fa fa-hand-spock-o"></i> Spock</button></p>'; }
			else if (answer[0] === 'P') {
				var rpsChart = {
					R: 'rock',
					P: 'paper',
					S: 'scissors',
					L: 'lizard',
					K: 'spock'
				};
				var rpsWinChart = {
					SP: 'cuts',
					SL: 'decapitates',
					PR: 'covers',
					PK: 'disproves',
					RL: 'crushes',
					RS: 'crushes',
					LK: 'poisons',
					LP: 'eats',
					KS: 'smashes',
					KR: 'vaporizes'
				};
				var my = ['R', 'P', 'S', 'L', 'K'][Math.floor(Math.random() * Number(answer[2]))];
				var your = answer[1];
				buf += '<p>I play <i class="fa fa-hand-' + rpsChart[my] + '-o"></i> ' + rpsChart[my] + '!</p>';
				if ((my + your) in rpsWinChart) { buf += '<p>And ' + rpsChart[my] + ' ' + rpsWinChart[my + your] + ' ' + rpsChart[your] + ', so I win!</p>'; } 
				else if ((your + my) in rpsWinChart) { buf += '<p>But ' + rpsChart[your] + ' ' + rpsWinChart[your + my] + ' ' + rpsChart[my] + ', so you win...</p>'; } 
				else { buf += '<p>We played the same thing, so it\'s a tie.</p>'; }
				if (!this.rpsScores || !this.rpsScores.length) { this.rpsScores = ['pi', '$3.50', '9.80665 m/s<sup>2</sup>', '28°C', '百万点', '<i class="fa fa-bitcoin"></i>0.0000174', '<s>priceless</s> <i class="fa fa-cc-mastercard"></i> MasterCard', '127.0.0.1', 'C&minus;, see me after class']; }
				var score = this.rpsScores.splice(Math.floor(Math.random() * this.rpsScores.length), 1)[0];
				buf += '<p>Score: ' + score + '</p>';
				buf += '<p><button class="button" name="greeting" value="SP' + answer[2] + '"><i class="fa fa-caret-square-o-right"></i> I demand a rematch!</button></p>';
			} else if (answer === 'YC') {
				buf += '<p>Okay, then I play peace sign <i class="fa fa-hand-peace-o"></i>, everyone signs a peace treaty, ending the war and ushering in a new era of prosperity.</p>';
				buf += '<p><button class="button" name="greeting" value="SP"><i class="fa fa-caret-square-o-right"></i> I wanted to play for real...</button></p>';
			}
			$(button).parent().replaceWith(buf);
		},
		background: function () { app.addPopup(CustomBackgroundPopup); },
		selectFolder: function (format) { if (format && format.currentTarget) {
				var e = format;
				format = $(e.currentTarget).data('value');
				e.preventDefault();
				if (format === '+') {
					e.stopImmediatePropagation();
					var self = this;
					app.addPopup(FormatPopup, { format: '', sourceEl: e.currentTarget, selectType: 'teambuilder', onselect: function (newFormat) { self.selectFolder(newFormat); } });
					return;
				}
				if (format === '++') {
					e.stopImmediatePropagation();
					var self = this;
					// app.addPopupPrompt("Folder name:", "Create folder", function (newFormat) {
					// 	self.selectFolder(newFormat + '/'); });
					app.addPopup(PromptPopup, { message: "Folder name:", button: "Create folder", sourceEl: e.currentTarget, callback: function (name) {
						name = $.trim(name);
						if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
							app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
							name = name.replace(/[\\\/]/g, '');
						}
						if (name.indexOf('|') >= 0) {
							app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
							name = name.replace(/\|/g, '');
						}
						if (!name) return;
						self.selectFolder(name + '/');
					} });
					return;
				}
			} else { this.curFolderKeep = format; }
			this.curFolder = (format === 'all' ? '' : format);
			this.updateFolderList();
			this.updateTeamList(true);
		},
		renameFolder: function () {
			if (!this.curFolder) return;
			if (this.curFolder.slice(-1) !== '/') return;
			var oldFolder = this.curFolder.slice(0, -1);
			var self = this;
			app.addPopup(PromptPopup, { message: "Folder name:", button: "Rename folder", value: oldFolder, callback: function (name) {
				name = $.trim(name);
				if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
					app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
					name = name.replace(/[\\\/]/g, '');
				}
				if (name.indexOf('|') >= 0) {
					app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
					name = name.replace(/\|/g, '');
				}
				if (!name) return;
				if (name === oldFolder) return;
				for (var i = 0; i < Storage.teams.length; i++) {
					var team = Storage.teams[i];
					if (team.folder !== oldFolder) continue;
					team.folder = name;
					if (window.nodewebkit) Storage.saveTeam(team);
				}
				if (!window.nodewebkit) Storage.saveTeams();
				self.selectFolder(name + '/');
			} });
		},
		promptDeleteFolder: function () { app.addPopup(DeleteFolderPopup, { folder: this.curFolder, room: this }); },
		deleteFolder: function (format, addName) {
			if (format.slice(-1) !== '/') return;
			var oldFolder = format.slice(0, -1);
			if (this.curFolderKeep === oldFolder) { this.curFolderKeep = ''; }
			for (var i = 0; i < Storage.teams.length; i++) {
				var team = Storage.teams[i];
				if (team.folder !== oldFolder) continue;
				team.folder = '';
				if (addName) team.name = oldFolder + ' ' + team.name;
				if (window.nodewebkit) Storage.saveTeam(team);
			}
			if (!window.nodewebkit) Storage.saveTeams();
			this.selectFolder('/');
		},
		show: function () {
			Room.prototype.show.apply(this, arguments);
			var $teamwrapper = this.$('.teamwrapper');
			var width = $(window).width();
			if (!$teamwrapper.length) return;
			if (width < 640) {
				var scale = (width / 640);
				$teamwrapper.css('transform', 'scale(' + scale + ')');
				$teamwrapper.addClass('scaled');
			} else {
				$teamwrapper.css('transform', 'none');
				$teamwrapper.removeClass('scaled');
			}
		},
		//region button actions
		revealFolder: function () { Storage.revealFolder(); },
		reloadTeamsFolder: function () { Storage.nwLoadTeams(); },
		edit: function (i) {
			this.teamScrollPos = this.$('.teampane').scrollTop();
			if (i && i.currentTarget) { i = $(i.currentTarget).data('value'); }
			i = +i;
			this.curTeam = teams[i];
			this.curTeam.iconCache = '!';
			this.curTeam.gen = this.getGen(this.curTeam.format);
			this.curTeam.dex = Dex.forGen(this.curTeam.gen);
			if (this.curTeam.format.includes('letsgo')) { this.curTeam.dex = Dex.mod('gen7letsgo'); }
			if (this.curTeam.format.includes('bdsp')) { this.curTeam.dex = Dex.mod('gen8bdsp'); }
			// IMPORTANT: Indigo Starstorm must use the modded Dex (so abilities include H/S when present)
			if (this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.toLowerCase().includes('isl')) {
				this.curTeam.dex = Dex.mod('gen9indigostarstorm');
			}
			// Update capacity for Indigo Starstorm if needed
			if (this.curTeam.capacity !== 24 && this.curTeam.capacity !== 50) {
				if ((this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.toLowerCase().includes('isl')) && this.curTeam.capacity !== 10) { this.curTeam.capacity = 10; } 
				else if (!(this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.toLowerCase().includes('isl')) && this.curTeam.capacity !== 6) { this.curTeam.capacity = 6; }
			}
			Storage.activeSetList = this.curSetList = Storage.unpackTeam(this.curTeam.team);
			for (var k = 0; k < this.curSetList.length; k++) {
				var s = this.curSetList[k];
				if (!s || !s.species) continue;
				var dex = this.curTeam.dex || Dex;
				var sp = dex.species.get(s.species);
				var ab = sp.abilities || {};
				var as = (s.abilitySet === 2 ? 2 : 1);
				if (as === 2) {
    				s.ability = ab.H || '';
    				s.ability2 = ab.S || '';
    				if (!s.ability && !s.ability2) { // fallback if set 2 doesn't exist
    					s.abilitySet = 1;
    					s.ability = ab['0'] || '';
    					s.ability2 = ab['1'] || '';
    				}
  				} else {
    				s.abilitySet = 1;
    				s.ability = ab['0'] || '';
    				s.ability2 = ab['1'] || '';
  				}
			}
			this.curTeamIndex = i;
			this.update();
			},
			"delete": function (i) {
				i = +i;
				this.deletedTeamLoc = i;
				this.deletedTeam = teams.splice(i, 1)[0];
				for (var room in app.rooms) {
					var selection = app.rooms[room].$('button.teamselect').val();
					if (!selection || selection === 'random') continue;
					var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
					if (i < obj.curTeamIndex) { obj.curTeamIndex--; } 
					else if (i === obj.curTeamIndex) { obj.curTeamIndex = -1; }
				}
				Storage.deleteTeam(this.deletedTeam);
				app.user.trigger('saveteams');
				this.updateTeamList();
			},
			undoDelete: function () { if (this.deletedTeamLoc >= 0) {
				teams.splice(this.deletedTeamLoc, 0, this.deletedTeam);
				for (var room in app.rooms) {
					var selection = app.rooms[room].$('button.teamselect').val();
					if (!selection || selection === 'random') continue;
					var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
					if (this.deletedTeamLoc < obj.curTeamIndex + 1) { obj.curTeamIndex++; } 
					else if (obj.curTeamIndex === -1) { obj.curTeamIndex = this.deletedTeamLoc; }
				}
				var undeletedTeam = this.deletedTeam;
				this.deletedTeam = null;
				this.deletedTeamLoc = -1;
				Storage.saveTeam(undeletedTeam);
				app.user.trigger('saveteams');
				this.update();
			}
		},
		saveBackup: function () {
			Storage.deleteAllTeams();
			Storage.importTeam(this.$('.teamedit textarea').val(), true);
			teams = Storage.teams;
			Storage.saveAllTeams();
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex = 0;
			}
			this.back();
		},
		"new": function (type) {
			var newTeam = this.createTeam(null, type === "box");
			teams.push(newTeam);
			this.edit(teams.length - 1);
		},
		newTop: function (type) {
			var newTeam = this.createTeam(null, type === "box");
			teams.unshift(newTeam);
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex++;
				obj.updateTeams();
			}
			this.edit(0);
		},
		duplicate: function (i) {
			var newTeam = this.createTeam(i ? teams[i] : null);
			teams.unshift(newTeam);
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex++;
			}
			this.edit(0);
		},
		createTeam: function (orig, isBox) {
			var newTeam;
			if (orig) { newTeam = {
					name: 'Copy of ' + orig.name,
					format: orig.format,
					team: orig.team,
					capacity: orig.capacity,
					folder: orig.folder,
					iconCache: ''
				};
			} else {
				var format = this.curFolder || 'gen9';
				var folder = '';
				if (format && format.charAt(format.length - 1) === '/') {
					folder = format.slice(0, -1);
					format = 'gen9';
				}
				newTeam = {
					name: (isBox ? 'Box ' : 'Untitled ') + (teams.length + 1),
					format: format,
					team: '',
					capacity: isBox ? 24 : (format && (format.includes('indigostarstorm') || format.includes('isl')) ? 10 : 6),
					folder: folder,
					iconCache: ''
				};
			}
			// work around Opera 42-45 crashing when persist() is called
			if (navigator.storage && navigator.storage.persist && !/ OPR\/4[0-5]/.test(navigator.userAgent)) {
				var self = this;
				navigator.storage.persist().then(function (state) { self.updatePersistence(state); });
			}
			return newTeam;
		},
		"import": function () {
			if (this.exportMode) return this.back();
			this.exportMode = true;
			if (!this.curTeam) { this['new'](); } 
			else { this.update(); }
		},
		backup: function () {
			this.curTeam = null;
			this.curSetList = null;
			this.exportMode = true;
			this.update();
		},
		psExport: function () {
			var cmd = '/teams ';
			cmd += this.curTeam.teamid ? 'update' : 'save';
			// teamName, formatid, rawPrivacy, rawTeam
			var buf = [];
			if (this.curTeam.teamid) buf.push(this.curTeam.teamid);
			buf.push(this.curTeam.name);
			buf.push(this.curTeam.format);
			buf.push(this.$('input[name=teamprivacy]').get(0).checked ? 1 : 0);
			var team = Storage.exportTeam(this.curSetList, this.curTeam.gen, false);
			if (!team) return app.addPopupMessage("Add a Pokémon to your team before uploading it!");
			buf.push(team);
			app.send(cmd + " " + buf.join(', '));
			this.exported = true;
			$('button[name=psExport]').addClass('disabled');
			$('button[name=psExport]')[0].disabled = true;
			$('label[name=editMessage]').hide();
		},
		pokepasteExport: function (type) {
			var team = Storage.exportTeam(this.curSetList, this.curTeam.gen, type === 'openteamsheet');
			if (!team) return app.addPopupMessage("Add a Pokémon to your team before uploading it!");
			document.getElementById("pasteData").value = team;
			document.getElementById("pasteTitle").value = this.curTeam.name;
			if (type === 'openteamsheet') { document.getElementById("pasteTitle").value += " (OTS)"; }
			document.getElementById("pasteAuthor").value = app.user.get('name');
			if (this.curTeam.format !== 'gen9') { document.getElementById("pasteNotes").value = "Format: " + this.curTeam.format; }
			document.getElementById("pokepasteForm").submit();
		},
		// drag and drop
		// because of a bug in Chrome and Webkit:
		//   https://code.google.com/p/chromium/issues/detail?id=410328
		// we can't use CSS :hover
		mouseOverTeam: function (e) { if (!e.currentTarget.className.endsWith('team-hover')) e.currentTarget.className += ' team-hover'; },
		mouseOutTeam: function (e) { if (e.currentTarget.className.endsWith('team-hover')) e.currentTarget.className = e.currentTarget.className.slice(0, -11); },
		dragStartTeam: function (e) {
			var dataTransfer = e.originalEvent.dataTransfer;
			dataTransfer.effectAllowed = 'copyMove';
			dataTransfer.setData("text/plain", "Team " + e.currentTarget.dataset.value);
			var team = Storage.teams[e.currentTarget.dataset.value];
			var filename = team.name;
			if (team.format) filename = '[' + team.format + '] ' + filename;
			filename = $.trim(filename).replace(/[\\\/]+/g, '') + '.txt';
			var urlprefix = "data:text/plain;base64,";
			// fixed in modern Chrome versions, and this route is no longer maintained
			// if (document.location.protocol === 'https:') {
			// 	// Chrome is dumb and doesn't support data URLs in HTTPS
			// 	urlprefix = "https://" + Config.routes.client + "/action.php?act=dlteam&team="; }
			var contents = Storage.exportTeam(team.team, team.gen).replace(/\n/g, '\r\n');
			var downloadurl = "text/plain:" + filename + ":" + urlprefix + encodeURIComponent(window.btoa(unescape(encodeURIComponent(contents))));
			console.log(downloadurl);
			dataTransfer.setData("DownloadURL", downloadurl);
			app.dragging = e.currentTarget;
			app.draggingRoom = this.id;
			app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10);
			var elOffset = $(e.currentTarget).offset();
			app.draggingOffsetX = e.originalEvent.pageX - elOffset.left;
			app.draggingOffsetY = e.originalEvent.pageY - elOffset.top;
			this.finalOffset = null;
			setTimeout(function () { $(e.currentTarget).parent().addClass('dragging'); }, 0);
		},
		dragEndTeam: function (e) { this.finishDrop(); },
		finishDrop: function () {
			var teamEl = app.dragging;
			app.dragging = null;
			var originalLoc = parseInt(teamEl.dataset.value, 10);
			if (isNaN(originalLoc)) { throw new Error("drag failed"); }
			var newLoc = Math.floor(app.draggingLoc);
			if (app.draggingLoc < originalLoc) newLoc += 1;
			var team = Storage.teams[originalLoc];
			var edited = false;
			if (newLoc !== originalLoc) {
				Storage.teams.splice(originalLoc, 1);
				Storage.teams.splice(newLoc, 0, team);
				for (var room in app.rooms) {
					var selection = app.rooms[room].$('button.teamselect').val();
					if (!selection || selection === 'random') continue;
					var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
					if (originalLoc === obj.curTeamIndex) { obj.curTeamIndex = newLoc; } 
					else if (originalLoc > obj.curTeamIndex && newLoc <= obj.curTeamIndex) { obj.curTeamIndex++; } 
					else if (originalLoc < obj.curTeamIndex && newLoc >= obj.curTeamIndex) { obj.curTeamIndex--; }
				}
				edited = true;
			}
			// possibly half-works-around a hover issue in
			this.$('.teamlist').css('pointer-events', 'none');
			$(teamEl).parent().removeClass('dragging');
			if (app.draggingFolder) {
				var $folder = $(app.draggingFolder);
				app.draggingFolder = null;
				var $plusOneFolder = $folder.find('.plusonefolder');
				$folder.removeClass('active');
				if (!$plusOneFolder.length) { $folder.prepend('<strong style="float:right;margin-right:3px;padding:0 2px;border-radius:3px;background:#CC8500;color:white" class="plusonefolder">+1</strong>'); } 
				else {
					var count = Number($plusOneFolder.text().substr(1)) + 1;
					$plusOneFolder.text('+' + count);
				}
				var format = $folder.data('value');
				if (format.slice(-1) === '/') { team.folder = format.slice(0, -1); } 
				else { team.format = format; }
				edited = true;
			}
			this.updateTeamList();
			if (edited) {
				Storage.saveTeam(team);
				app.user.trigger('saveteams');
				this.exported = false;
				$('button[name=psExport]').removeClass('disabled');
				$('button[name=psExport]')[0].disabled = false;
				$('label[name=editMessage]').show();
			}
			// We're going to try to animate the team settling into its new position
			if (this.finalOffset) {
				// event.pageY and event.pageX are buggy on literally every browser:
				//   in Chrome:
				// event.pageX|pageY is the position of the bottom left corner of the draggable, instead
				// of the mouse position
				//   in Safari:
				// window.innerHeight * 2 - window.outerHeight - event.pageY is the mouse position
				// No, I don't understand what's going on, either, but unsurprisingly this fails utterly
				// if the page is zoomed.
				//   in Firefox:
				// event.pageX|pageY are straight-up unsupported
				// if you don't believe me, uncomment and see for yourself:
				// console.log('x,y = ' + [e.originalEvent.x, e.originalEvent.y]);
				// console.log('screenX,screenY = ' + [e.originalEvent.screenX, e.originalEvent.screenY]);
				// console.log('clientX,clientY = ' + [e.originalEvent.clientX, e.originalEvent.clientY]);
				// console.log('pageX,pageY = ' + [e.originalEvent.pageX, e.originalEvent.pageY]);
				// Because of this, we're just going to steal the values from the drop event, where
				// everything is sane.
				var $newTeamEl = this.$('.team[data-value=' + newLoc + ']');
				if (!$newTeamEl.length) return;
				var finalPos = $newTeamEl.offset();
				$newTeamEl.css('transform', 'translate(' + (this.finalOffset[0] - finalPos.left) + 'px, ' + (this.finalOffset[1] - finalPos.top) + 'px)');
				setTimeout(function () {
					$newTeamEl.css('transition', 'transform 0.15s');
					// it's 2015 and Safari doesn't support unprefixed transition!!!
					$newTeamEl.css('-webkit-transition', '-webkit-transform 0.15s');
					$newTeamEl.css('transform', 'translate(0px, 0px)');
				});
			}
		},
		dragEnterTeam: function (e) {
			if (!app.dragging) return;
			var $draggingLi = $(app.dragging).parent();
			this.dragLeaveFolder();
			if (e.currentTarget === app.dragging) { e.preventDefault();
				return;
			}
			var hoverLoc = parseInt(e.currentTarget.dataset.value, 10);
			if (app.draggingLoc > hoverLoc) { // dragging up
				$(e.currentTarget).parent().before($draggingLi);
				app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10) - 0.5;
			} else { // dragging down
				$(e.currentTarget).parent().after($draggingLi);
				app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10) + 0.5;
			}
		},
		dragEnterFolder: function (e) {
			if (!app.dragging) return;
			this.dragLeaveFolder();
			if (e.currentTarget === app.draggingFolder) { return; }
			var format = e.currentTarget.dataset.value;
			if (format === '+' || format === '++' || format === 'all' || format === this.curFolder) { return; }
			if (parseInt(app.dragging.dataset.value, 10) >= Storage.teams.length && format.slice(-1) !== '/') { return; } // dragging a team file, already has a known format
			app.draggingFolder = e.currentTarget;
			$(app.draggingFolder).addClass('active');
			// amusing note: using .detach() instead of .hide() will make `dragend` not fire
			$(app.dragging).parent().hide();
		},
		dragLeaveFolder: function (e) {
			// sometimes there's a race condition and dragEnter happens before dragLeave
			if (e && e.currentTarget !== app.draggingFolder) return;
			if (!app.dragging || !app.draggingFolder) return;
			$(app.draggingFolder).removeClass('active');
			app.draggingFolder = null;
			$(app.dragging).parent().show();
		},
		defaultDragEnterTeam: function (e) {
			var dataTransfer = e.originalEvent.dataTransfer;
			if (!dataTransfer) return;
			if (dataTransfer.types.indexOf && dataTransfer.types.indexOf('Files') === -1) return;
			if (dataTransfer.types.contains && !dataTransfer.types.contains('Files')) return;
			if (dataTransfer.files[0] && dataTransfer.files[0].name.slice(-4) !== '.txt') return;
			// We're dragging a file! It might be a team!
			if (app.curFolder && app.curFolder.slice(-1) !== '/') { this.selectFolder('all'); }
			this.$('.teamlist').append('<li class="dragging"><div class="team" data-value="' + Storage.teams.length + '"></div></li>');
			app.dragging = this.$('.dragging .team')[0];
			app.draggingRoom = this.id;
			app.draggingLoc = Storage.teams.length;
			app.draggingOffsetX = 180;
			app.draggingOffsetY = 25;
		},
		defaultDropTeam: function (e) {
			if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
				var file = e.originalEvent.dataTransfer.files[0];
				var name = file.name;
				if (name.slice(-4) !== '.txt') {
					app.dragging = null;
					this.updateTeamList();
					app.addPopupMessage("Your file is not a valid team. Team files are .txt files.");
					return;
				}
				var reader = new FileReader();
				var self = this;
				reader.onload = function (e) {
					var team;
					try { team = Storage.packTeam(Storage.importTeam(e.target.result)); } 
					catch (err) {
						app.addPopupMessage("Your file is not a valid team.");
						self.updateTeamList();
						return;
					}
					var name = file.name;
					if (name.slice(name.length - 4).toLowerCase() === '.txt') { name = name.substr(0, name.length - 4); }
					var format = '';
					var bracketIndex = name.indexOf(']');
					var capacity = 6;
					if (bracketIndex >= 0) {
						format = name.substr(1, bracketIndex - 1);
						if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
						if (format && format.endsWith('-box')) {
							format = format.slice(0, -4);
							capacity = 50;
					} else if (format && (format.includes('indigostarstorm') || format.includes('isl'))) {
						capacity = 10;
					}
					name = $.trim(name.substr(bracketIndex + 1));
					}
					Storage.teams.push({
						name: name,
						format: format,
						team: team,
						capacity: capacity,
						folder: '',
						iconCache: ''
					});
					self.finishDrop();
				};
				reader.readAsText(file);
			}
			this.finalOffset = [e.originalEvent.pageX - app.draggingOffsetX, e.originalEvent.pageY - app.draggingOffsetY];
		},
		/*********************************************************
		 * Team view
		 *********************************************************/
		updateTeamView: function () {
			this.curChartName = '';
			this.curChartType = '';
			var buf = '';
			if (this.exportMode) {
				buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> <input class="textbox teamnameedit" type="text" class="teamnameedit" size="30" value="' + BattleLog.escapeHTML(this.curTeam.name) + '" /> <button name="saveImport" class="button"><i class="fa fa-upload"></i> Import/Export</button> <button name="saveImport" class="savebutton button"><i class="fa fa-floppy-o"></i> Save</button></div>';
				buf += '<div class="teamedit"><textarea class="textbox" rows="17">' + BattleLog.escapeHTML(Storage.exportTeam(this.curSetList, this.curTeam.gen)) + '</textarea></div>';
			} else {
				buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> ';
				buf += '<input class="textbox teamnameedit" type="text" class="teamnameedit" size="30" value="' + BattleLog.escapeHTML(this.curTeam.name) + '" /> ';
				buf += '<button name="import" class="button"><i class="fa fa-upload"></i> Import/Export</button> ';
				buf += '<div class="teamchartbox">';
				buf += '<ol class="teamchart">';
				buf += '<li>' + this.clipboardHTML() + '</li>';
				var i = 0;
				if (this.curSetList.length && !this.curSetList[this.curSetList.length - 1].species) { this.curSetList.splice(this.curSetList.length - 1, 1); }
				var isGenericFormat = function (formatName) {
					if (!formatName) return true;
					if (/^gen\d+$/.test(formatName)) return true;
					return false;
				};
				if (this.loadingTeam) buf += '<div style="message-error">Downloading team from server...</strong><br />';
				buf += '<label name="editMessage" style="display: none">';
				buf += 'Remember to click the upload button below to sync your changes to the server!</label><br />';
				if (exports.BattleFormats) {
					buf += '<li class="format-select">';
					buf += '<label class="label">Format:</label><button class="select formatselect teambuilderformatselect" name="format" value="' + this.curTeam.format + '">' + (isGenericFormat(this.curTeam.format) ? '<em>Select a format</em>' : BattleLog.escapeFormat(this.curTeam.format)) + '</button>';
					var btnClass = 'button' + (!this.curSetList.length || app.isDisconnected ? ' disabled' : '');
					buf += ' <button name="validate" class="' + btnClass + '"><i class="fa fa-check"></i> Validate</button></li>';
				}
				if (!this.curSetList.length) { buf += '<li><em>you have no pokemon lol</em></li>'; }
				for (i = 0; i < this.curSetList.length; i++) {
					if (this.curSetList.length < this.curTeam.capacity && this.deletedSet && i === this.deletedSetLoc) { buf += '<li><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></li>'; }
					buf += this.renderSet(this.curSetList[i], i);
				}
				if (this.deletedSet && i === this.deletedSetLoc) { buf += '<li><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></li>'; }
				if (i === 0) { buf += '<li><button name="import" class="button big"><i class="fa fa-upload"></i> Import from text or URL</button></li>'; }
				if (i < this.curTeam.capacity) { buf += '<li><button name="addPokemon" class="button big"><i class="fa fa-plus"></i> Add Pok&eacute;mon</button></li>'; }
				buf += '</ol>';
				var formatInfo = this.formatResources[this.curTeam.format];
				// data's there and loaded
				if (formatInfo && formatInfo !== true) {
					if (formatInfo.resources.length || formatInfo.url) {
						buf += '<div style="padding-left: 5px"><h3 style="font-size: 12px">Teambuilding resources for this tier:</h3></div><ul>';
						for (var i = 0; i < formatInfo.resources.length; i++) {
							var resource = formatInfo.resources[i];
							buf += '<li><p><a href="' + resource.url + '" target="_blank">' + resource.resource_name + '</a></p></li>';
						}
					}
					buf += '</ul>';
					var desc = formatInfo.resources.length ? 'more ' : '';
					buf += '<div style="padding-left: 5px">Find ' + desc + 'helpful resources for this tier on <a href="' + formatInfo.url + '" target="_blank">the Smogon Dex</a>.</div>';
				}
				buf += '<form id="pokepasteForm" style="display:inline" method="post" action="https://pokepast.es/create" target="_blank">';
				buf += '<input type="hidden" name="title" id="pasteTitle">';
				buf += '<input type="hidden" name="paste" id="pasteData">';
				buf += '<input type="hidden" name="author" id="pasteAuthor">';
				buf += '<input type="hidden" name="notes" id="pasteNotes">';
				buf += '<p><button name="psExport" type="submit" class="button exportbutton"> <i class="fa fa-upload"></i> Upload to Showdown database (saves across devices)</button>';
				var privacy = (Storage.prefs('uploadprivacy') || typeof Storage.prefs('uploadprivacy') !== 'boolean') ? 'checked' : '';
				buf += ' <label><small>(Private:</small> <input type="checkbox" name="teamprivacy" ' + privacy + ' /><small>)</small></label>';
				buf += '</p>';
				buf += '<p><button name="pokepasteExport" type="submit" class="button exportbutton"><i class="fa fa-upload"></i> Upload to PokePaste</button></p>';
				if (this.curTeam.format.includes('vgc')) { buf += '<p><button name="pokepasteExport" value="openteamsheet" type="submit" class="button exportbutton"><i class="fa fa-upload"></i> Upload to PokePaste (Open Team Sheet)</button></p>'; }
				buf += '</form></div>';
			}
			this.$el.html('<div class="teamwrapper">' + buf + '</div>');
			this.$(".teamedit textarea").focus().select();
			if ($(window).width() < 640) this.show();
		},



		//region Teambuilder main panel
		getAffinityAversionFlags: function (types) {
			var flagCounts = {};
			// Count affinity and aversion for each type
			for (var i = 0; i < types.length; i++) {
				var typeID = types[i].toLowerCase();
				var typeData = TypeAffinityAversion[typeID];
				if (!typeData) continue;
				// Add affinity flags (+1)
				if (typeData.affinity) { for (var flag in typeData.affinity) { flagCounts[flag] = (flagCounts[flag] || 0) + 1; } }
				// Subtract aversion flags (-1)
				if (typeData.aversion) { for (var flag in typeData.aversion) { flagCounts[flag] = (flagCounts[flag] || 0) - 1; } }
			}
			// Separate into affinity (positive) and aversion (negative) arrays with their counts
			var affinityFlags = [];
			var aversionFlags = [];
			for (var flag in flagCounts) {
				if (flagCounts[flag] > 0) { affinityFlags.push({flag: flag, count: flagCounts[flag]}); } 
				else if (flagCounts[flag] < 0) { aversionFlags.push({flag: flag, count: Math.abs(flagCounts[flag])}); }
			}
			// Sort alphabetically for consistent display
			affinityFlags.sort(function(a, b) { return a.flag.localeCompare(b.flag); });
			aversionFlags.sort(function(a, b) { return a.flag.localeCompare(b.flag); });
			return {
				affinity: affinityFlags,
				aversion: aversionFlags
			};
		},
		renderSet: function (set, i) {
			var species = this.curTeam.dex.species.get(set.species);
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');
			var buf = '<li value="' + i + '">';
			if (!set.species) {
				if (this.deletedSet) { buf += '<div class="setmenu setmenu-left"><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></div>'; }
				buf += '<div class="setmenu"><button name="importSet"><i class="fa fa-upload"></i>Import</button></div>';
				buf += '<div class="setchart" style="background-image:url(' + Dex.resourcePrefix + 'sprites/gen5/0.png);"><div class="setcol setcol-icon"><div class="setcell-sprite"></div><div class="setcell setcell-pokemon"><label>Pok&eacute;mon</label><input type="text" name="pokemon" class="textbox chartinput" value="" autocomplete="off" /></div></div></div>';
				buf += '</li>';
				return buf;
			}
			buf += '<div style="clear: both"></div>';
			buf += '<div class="setchart-nickname" style="position: relative; padding-right: 320px;">';
			buf += '<label>Nickname</label><input type="text" name="nickname" class="textbox" value="' + BattleLog.escapeHTML(set.name || '') + '" placeholder="' + BattleLog.escapeHTML(species.baseSpecies) + '" />';
			// ---- Copy/Import/Move/Delete row (shrink-to-fit, pinned right) ----
			buf += '<div class="setmenu" style="position:absolute; left: 115px; top: -1px; white-space:nowrap; width:auto;">' +	'<button name="copySet" style="padding: 1px 4px; font-size: 11px;"><i class="fa fa-files-o"></i>Copy</button> ' +
			'<button name="importSet" style="padding: 1px 4px; font-size: 11px;"><i class="fa fa-upload"></i>Import/Export</button> ' +
			'<button name="moveSet" style="padding: 1px 4px; font-size: 11px;"><i class="fa fa-arrows"></i>Move</button> ' +
			'<button name="deleteSet" style="padding: 1px 4px; font-size: 11px;"><i class="fa fa-trash"></i>Delete</button>' +
			'</div>';
			// ---- Form/Forme button OUTSIDE the box (next to Nickname) ----
			var dex = this.curTeam.dex;
			var baseSpecies = dex.species.get(species.baseSpecies);
			// "Real formes" = otherFormes that are NOT cosmetic (and NOT Mega/Gmax)
			var hasRealFormes = false;
			var eligibleAltCount = 0;
			// Build a fast lookup of cosmetic formes for this base species
			var cosmeticLookup = Object.create(null);
			if (baseSpecies.cosmeticFormes && baseSpecies.cosmeticFormes.length) { for (var c = 0; c < baseSpecies.cosmeticFormes.length; c++) { cosmeticLookup[toID(baseSpecies.cosmeticFormes[c])] = true; } }
			if (baseSpecies.otherFormes && baseSpecies.otherFormes.length) {
			for (var f = 0; f < baseSpecies.otherFormes.length; f++) {
				var formeName = baseSpecies.otherFormes[f];
				var formeId = toID(formeName);
				var sp = dex.species.get(formeName);
				if (!sp) continue;
				// EXCLUDE Mega/Gmax ONLY for this forme UI
				if (sp.isMega || sp.forme === 'Mega' || sp.forme === 'Gmax' || /-Mega(-[XY])?$/i.test(sp.name) || /-Gmax$/i.test(sp.name)) { continue; }
				eligibleAltCount++;
				// Treat as cosmetic if explicitly listed OR flagged cosmetic
				var isCosmetic = !!cosmeticLookup[formeId] || !!(sp && (sp.isCosmeticForme || sp.isCosmetic));
				if (!isCosmetic) { hasRealFormes = true; }
			}
		}
		// "Cosmetic forms" = cosmeticFormes (and at least one exists after filtering)
		var hasCosmeticForms = false;
		if (baseSpecies.cosmeticFormes && baseSpecies.cosmeticFormes.length) {
			for (var c2 = 0; c2 < baseSpecies.cosmeticFormes.length; c2++) {
				var cfName = baseSpecies.cosmeticFormes[c2];
				var cfSp = dex.species.get(cfName);
				if (!cfSp) continue;
				if (cfSp.isMega || cfSp.forme === 'Mega' || cfSp.forme === 'Gmax' || /-Mega(-[XY])?$/i.test(cfSp.name) || /-Gmax$/i.test(cfSp.name)) { continue; }
				hasCosmeticForms = true;
				eligibleAltCount++;
				break;
			}
		}
		// Only show the button if there is at least one eligible (non-mega/non-gmax) alt
		var hasAlt = eligibleAltCount > 0;
		// ---------- Level (ALWAYS visible) ----------
		buf += '<div style="position:absolute; left:118px; top:16px; display:flex; align-items:flex-end; gap:4px;">';
		buf += '<label style="font-size:10px; margin:0; position:relative; top:-4px;">Level</label>';
		buf += '<input type="number" name="level" class="textbox" value="' + (set.level || 100) + '" min="1" max="100" ' +
	       'style="width:32px; height:15px; font-size:10px; padding:1px 4px;" />';
		buf += '</div>';
		// ---- Shiny checkbox (ALWAYS show; in nickname row) ----
		if (this.curTeam.gen > 1) {
			buf += '<div style="position:absolute; left: 209px; top: 22px; z-index:10; display:flex; align-items:center; gap:4px;">';
			buf += '<label style="font-size:10px; margin:0; cursor:pointer; position:relative; top:-1px;">Shiny</label>';
			buf += '<input type="checkbox" name="shiny" class="shiny-checkbox"' + (set.shiny ? ' checked' : '') +
				' style="margin:0; cursor:pointer; width:12px; height:12px;" />';
			buf += '</div>';
		}
		if (hasAlt) {
			// Label: Forme (real formes exist) vs Form (cosmetic-only)
			var ffLabel = hasRealFormes ? 'Forme' : 'Form';
			// Button text: everything after the first hyphen in set.species (e.g. "Poltchageist-Artisan" -> "Artisan")
			var dash = set.species.indexOf('-');
			var ffText = (dash >= 0 ? set.species.slice(dash + 1) : 'Base');
			// Absolutely positioned so it DOES NOT push anything
			buf += '<div style="position: absolute; left: 270px; top: 14px; display: flex; align-items: flex-end;">';
			buf += '<label style="font-size: 10px; margin: 0; position: relative; top: -3px;">' + ffLabel + '</label>';
			buf += '<button type="button" class="textbox altform" name="altform" style="width: 80px; font-size: 10px; padding: 1px 4px; height: 18px; cursor: pointer; text-align: left;">' +
    		BattleLog.escapeHTML(ffText) + '</button>';
			buf += '</div>';
		}
		buf += '</div>';
		buf += '<div class="setchart" style="' + this.getScaledTeambuilderSpriteStyle(set) + '">';
		// icon
		buf += '<div class="setcol setcol-icon" style="position: relative;">';
		// Size dropdown (top-right)
		buf += '<div class="size-in-sprite" style="position:absolute; bottom:32px; right: 0px; z-index:20; align-items:flex-end; gap:6px;">' +
			'<label style="font-size:10px; margin:0; position:relative; top:-1px;">Size</label>' +
			'<select name="size" class="textbox" style="width:24px; height:15px; padding-left:2px; font-size:9px; appearance:none; -webkit-appearance:none; -moz-appearance:none; padding-right:2px; text-align:center;">' +
			'<option value="XS"' + (set.size === 'XS' ? ' selected' : '') + '>XS</option>' +
			'<option value="S"' + (set.size === 'S' ? ' selected' : '') + '>S</option>' +
			'<option value="M"' + (!set.size || set.size === 'M' ? ' selected' : '') + '>M</option>' +
			'<option value="L"' + (set.size === 'L' ? ' selected' : '') + '>L</option>' +
			'<option value="XL"' + (set.size === 'XL' ? ' selected' : '') + '>XL</option>' +
			'</select></div>';
		buf += '<div class="setcell-sprite" style="margin-left: 10px;"></div>';	
		buf += '<div class="setcell setcell-pokemon"><label>Pok&eacute;mon</label><input type="text" name="pokemon" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.species) + '" autocomplete="off" /></div></div>';
		// ---- Height/Weight (computed once, used under Tera icon) ----
		var baseWeight = species.weightkg || 0;
		var baseHeight = species.heightm || 0;
		var sizeWeightModifier = species.sizeWeightModifier !== undefined ? species.sizeWeightModifier : 0.1;
		var sizeTiers = 0;
		var size = set.size || 'M';
		if (size === 'XS') sizeTiers = -2;
		else if (size === 'S') sizeTiers = -1;
		else if (size === 'L') sizeTiers = 1;
		else if (size === 'XL') sizeTiers = 2;
		var modifiedWeight = baseWeight * (1 + (sizeTiers * sizeWeightModifier));
		var modifiedHeight = baseHeight * (1 + (sizeTiers * sizeWeightModifier));
		// details
		buf += '<div class="setcol setcol-details"><div class="setrow">';
		buf += '<div class="setcell setcell-details"><label style="position: relative; top: 6px;">Type';
		// Type icons 
		var types = species.types;
		// Apply Indigo Starstorm type overrides
		var isIndigoStarstorm = this.curTeam.format && (this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.includes('isl'));
		if (isIndigoStarstorm && IndigoStarstormTypes[toID(species.name)]) { types = IndigoStarstormTypes[toID(species.name)]; }
		if (types) {
			buf += '<span style="margin-left: 8px; vertical-align: middle; position: relative; ;">';
			for (var i = 0; i < types.length; i++) buf += Dex.getTypeIcon(types[i]);
			buf += '</span>';
			// Tera Type icon below type icons
			if (this.curTeam.gen === 9) {
				var teraType = set.teraType || species.requiredTeraType || species.types[0];
				buf += '<br><button type="button" class="teratype" name="teraType" value="' + BattleLog.escapeHTML(teraType) + '" style="background: none; border: none; padding: 0; cursor: pointer; width: 20px; height: 20px; margin-left: 4px; position: relative; top: 4px;">';
				buf += '<img src="' + Dex.resourcePrefix + 'sprites/types/Tera' + teraType + '.png" alt="' + teraType + '" style="width: 20px; height: 20px; object-fit: contain; display: block; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.5));" />';
				buf += '</button>';
				buf += '<div style="margin-top: 11px; margin-left: 2px; font-size: 9px; line-height: 1.1; text-align: left;">' +
				'<span class="height-display" style="display:block;">' + modifiedHeight.toFixed(1) + ' m</span>' +
				'<span class="weight-display" style="display:block;">' + modifiedWeight.toFixed(1) + ' kg</span>' +
				'</div>';
			}
		}
		buf += '</label>';
		buf += '<div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">';
		buf += '<div style="display: flex; flex-direction: column;">';
		buf += '</div>';
		if (this.curTeam.gen > 1) {
			if (isLetsGo) { buf += '<label style="font-size: 10px;">Happiness</label><input type="number" name="happiness" class="textbox" value="' + (typeof set.happiness === 'number' ? set.happiness : 70) + '" min="0" max="255" style="width: 50px;" />'; } 
			else if (this.curTeam.gen < 8 || isNatDex) { buf += '<label style="font-size: 10px;">Happiness</label><input type="number" name="happiness" class="textbox" value="' + (typeof set.happiness === 'number' ? set.happiness : 255) + '" min="0" max="255" style="width: 50px;" />'; }
		}
		buf += '</div></div></div>';
		// item icon
		buf += '<div class="setrow setrow-icons">';
		buf += '<div class="setcell" style="position: relative; left: 95px; top: 25px;">';
		var itemicon = '<span class="itemicon"></span>';
		var itemName = '';
		if (set.item) {
			var itemId = toID(set.item);
			if (itemId in BattleItems) {
				var item = BattleItems[itemId];
				itemicon = '<span class="itemicon" style="' + Dex.getItemIcon(item) + '"></span>';
				itemName = item.name;
			} else { itemName = set.item; }
		}
		buf += itemicon;
		buf += '</div></div>';
		buf += '<div class="setrow">';
		if (this.curTeam.gen > 1 && !isLetsGo) buf += '<div class="setcell setcell-item"><label>Item</label><input type="text" name="item" class="textbox chartinput" value="' + BattleLog.escapeHTML(itemName) + '" autocomplete="off" /></div>';
		buf += '</div>';
		buf += '</div>';
		// Ability Set column
		if (this.curTeam.gen > 2 && !isLetsGo) {
			var abilitySet = set.abilitySet || 1;
			// Check if Pokemon has H or S abilities
			var hasHiddenOrS = !!(species.abilities['H'] || species.abilities['S']);
			var buttonStyle, buttonClass, buttonName, buttonText;
			if (!hasHiddenOrS) {
				// No H or S ability - show centered gold button, not toggleable
				buttonStyle = 'width: 36px; font-weight: bold; font-size: 10.5px; padding: 1.5px 0; height: 18px; background: rgba(218, 165, 32, 0.4); text-align: center; pointer-events: none; text-indent: -1px;';
				buttonClass = '';
				buttonName = '';
				buttonText = '1';
			} else {
				// Has H or S ability - show toggleable button
				buttonStyle = abilitySet === 1 
					? 'width: 36px; font-weight: bold; font-size: 10.5px; cursor: pointer; padding: 1.5px 0; height: 18px; background: linear-gradient(to right, rgba(0, 255, 0, 0.3) 50%, transparent 50%); text-align: left; padding-left: 5.4px;'
					: 'width: 36px; font-weight: bold; font-size: 10.5px; cursor: pointer; padding: 1.5px 0; height: 18px; background: linear-gradient(to left, rgba(0, 100, 255, 0.3) 50%, transparent 50%); text-align: right; padding-right: 5.4px;';
				buttonClass = ' abilitySetToggle';
				buttonName = ' name="abilitySetToggle" data-setindex="' + i + '"';
				buttonText = abilitySet;
			}
			buf += '<div class="setcol setcol-ability" style="align-content: end; position: relative; top: -5px;">'; ;
if (this.curTeam.gen > 1) {
				// Gender button
				var speciesGender = species.gender; // 'M', 'F', 'N', or undefined
				var currentGender = set.gender || '';
				var genderButton = '';
				if (speciesGender === 'N') {
					// Genderless - grey button with em dash
					genderButton = '<button type="button" class="textbox genderToggle" name="genderToggle" data-value="" style="width: 36px; font-weight: bold; font-size: 12px; pointer-events: none; padding: 1.5px 0; height: 18px; background: rgba(128, 128, 128, 0.3); text-align: center;"><span style="position: relative; top: -2px;">—</span></button>';
				} else if (speciesGender === 'M') {
					// 100% Male - centered blue button
					genderButton = '<button type="button" class="textbox genderToggle" name="genderToggle" data-value="M" style="width: 36px; font-weight: bold; font-size: 12px; pointer-events: none; padding: 1.5px 0; height: 18px; background: rgba(0, 150, 255, 0.3); text-align: center;"><span style="position: relative; top: -0.75px; left: -1px; color: #0004ffff;">♂</span></button>';
				} else if (speciesGender === 'F') {
					// 100% Female - centered pink button
					genderButton = '<button type="button" class="textbox genderToggle" name="genderToggle" data-value="F" style="width: 36px; font-weight: bold; font-size: 12px; pointer-events: none; padding: 1.5px 0; height: 18px; background: rgba(255, 100, 150, 0.3); text-align: center;"><span style="position: relative; top: -2px; left: -1px; color: #ff0055ff;">♀</span></button>';
				} else {
					// Can be Male or Female - toggle button (default to Male if not set)
					var isMale = currentGender === 'M' || !currentGender;
					if (isMale) {
					genderButton = '<button type="button" class="textbox genderToggle" name="genderToggle" data-value="M" style="width: 36px; font-weight: bold; font-size: 12px; cursor: pointer; padding: 1.5px 0; height: 18px; background: linear-gradient(to right, rgba(0, 150, 255, 0.3) 50%, transparent 50%); text-align: left; padding-left: 6px;"><span style="position: relative; top: -0.75px; right: 2px; color: #0004ffff;">♂</span></button>'; } 
					else { genderButton = '<button type="button" class="textbox genderToggle" name="genderToggle" data-value="F" style="width: 36px; font-weight: bold; font-size: 12px; cursor: pointer; padding: 1.5px 0; height: 18px; background: linear-gradient(to left, rgba(255, 100, 150, 0.3) 50%, transparent 50%); text-align: right; padding-right: 6px;"><span style="position: relative; top: -1.5px; left: 1px; color: #ff0055ff;">♀</span></button>'; }
				}
				buf += '<div style="display:flex; flex-direction:column; gap:3px; position:relative; top:-34px; left:16px;">';
				buf += '<div style="display: flex; align-items: center; gap: 7px;"><label style="font-size: 10.5px;">Gender</label>' + genderButton + '</div>';
				buf += '</div>';
			}
			//ability set
			buf += '<div class="setcell">';
			buf += '<div style="display: flex; align-items: end; gap: 4px;"><label style="margin: 0;">Ability Set</label><button type="button" class="textbox' + buttonClass + '"' + buttonName + ' data-value="' + abilitySet + '" style="' + buttonStyle + '">' + buttonText + '</button></div>';
			buf += '</div>';
			buf += '<div class="setcell">';
			buf += '<input type="text" name="ability" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.ability) + '" autocomplete="off" style="margin: 0;" />';
			buf += '</div>';
			buf += '<div class="setcell">';
			buf += '<input type="text" name="ability2" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.ability2 || '') + '" autocomplete="off" style="margin: 0;" />';
			buf += '</div>';
			buf += '</div>';
		}
			if (!set.moves) set.moves = [];
			buf += '<div class="setcol setcol-moves"><div class="setcell"><label>Moves</label>';
			buf += '<input type="text" name="move1" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[0]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move2" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[1]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move3" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[2]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move4" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[3]) + '" autocomplete="off" /></div>';
			buf += '</div>';
			// Affinity/Aversion column
			var affinityAversion = this.getAffinityAversionFlags(types);
			if (affinityAversion.affinity.length > 0 || affinityAversion.aversion.length > 0) {
				buf += '<div class="setcol setcol-affinity">';
				if (affinityAversion.affinity.length > 0) {
					var affinityHeight = 16;
					if (affinityAversion.affinity.length >= 16) affinityHeight = 66;
					else if (affinityAversion.affinity.length >= 13) affinityHeight = 56;
					else if (affinityAversion.affinity.length >= 10) affinityHeight = 46;
					else if (affinityAversion.affinity.length >= 7) affinityHeight = 36;
					else if (affinityAversion.affinity.length >= 4) affinityHeight = 26;
					buf += '<div class="setcell"><label style="font-size: 8px;">Affinity - <span style="background: rgba(0,0,0,0.8); padding: 1px 3px; border-radius: 2px;"><span style="color: #5BA3FF; font-weight: bold;">1.1x</span> - <span style="color: #00CED1; font-weight: bold;">1.2x</span></span></label>';
					buf += '<div style="display: inline-block; background: rgba(94, 161, 114, 0.4); padding: 3px 6px 3px 0px; border-radius: 3px; vertical-align: top; height: ' + affinityHeight + 'px; width: 164px;">';
					buf += '<div style="display: flex; flex-direction: row; flex-wrap: wrap; align-content: flex-start; gap: 10.5px; width: 417px; height: 128px; transform: scale(0.38); transform-origin: left top; line-height: 0;">';
					for (var i = 0; i < affinityAversion.affinity.length; i++) {
						var flagData = affinityAversion.affinity[i];
						var filter = '';
						// 2x affinity: cyan, 1x affinity: blue
						if (flagData.count >= 2) { filter = 'filter: sepia(100%) saturate(300%) hue-rotate(140deg) brightness(1.1);'; } 
						else { filter = 'filter: sepia(100%) saturate(400%) hue-rotate(180deg) brightness(0.9);'; }
						var style = 'position: relative;';
						if (i >= 15) style += ' top: -52px; left: 26px;';
						else if (i >= 12) style += ' top: -42px;';
						else if (i >= 9) style += ' top: -31px; left: 26px;';
						else if (i >= 6) style += ' top: -21px;';
						else if (i >= 3) style += ' top: -10px; left: 26px;';
						style += ' ' + filter + ' cursor: pointer;';
						buf += Dex.getFlagIcon(flagData.flag).replace('<img', '<img class="affinity-flag-icon" data-flag="' + BattleLog.escapeHTML(flagData.flag) + '" style="' + style + '"');
					}
					buf += '</div></div>';
					buf += '</div>';
				}
				if (affinityAversion.aversion.length > 0) {
					var aversionHeight = 16;
					if (affinityAversion.aversion.length >= 16) aversionHeight = 66;
					else if (affinityAversion.aversion.length >= 13) aversionHeight = 56;
					else if (affinityAversion.aversion.length >= 10) aversionHeight = 46;
					else if (affinityAversion.aversion.length >= 7) aversionHeight = 36;
					else if (affinityAversion.aversion.length >= 4) aversionHeight = 26;
					buf += '<div class="setcell" style="margin-top: 3px;"><label style="font-size: 8px;">Aversion - <span style="background: rgba(0,0,0,0.8); padding: 1px 3px; border-radius: 2px;"><span style="color: #FFD700; font-weight: bold;">0.9x</span> - <span style="color: #FF6B6B; font-weight: bold;">0.8x</span></span></label>';
					buf += '<div style="display: inline-block; background: rgba(161, 94, 94, 0.4); padding: 3px 6px 3px 0px; border-radius: 3px; vertical-align: top; height: ' + aversionHeight + 'px; width: 164px;">';
					buf += '<div style="display: flex; flex-direction: row; flex-wrap: wrap; align-content: flex-start; gap: 10.5px; width: 417px; height: 128px; transform: scale(0.38); transform-origin: left top; line-height: 0;">';
					for (var i = 0; i < affinityAversion.aversion.length; i++) {
						var flagData = affinityAversion.aversion[i];
						var filter = '';
						// 2x aversion: red, 1x aversion: orange
						if (flagData.count >= 2) { filter = 'filter: sepia(100%) saturate(1000%) hue-rotate(-50deg) brightness(0.9);'; } 
						else { filter = 'filter: sepia(100%) saturate(800%) hue-rotate(-5deg) brightness(1.1);'; }
						var style = 'position: relative;';
						if (i >= 15) style += ' top: -52px; left: 26px;';
						else if (i >= 12) style += ' top: -42px;';
						else if (i >= 9) style += ' top: -31px; left: 26px;';
						else if (i >= 6) style += ' top: -21px;';
						else if (i >= 3) style += ' top: -10px; left: 26px;';
						style += ' ' + filter + ' cursor: pointer;';
						buf += Dex.getFlagIcon(flagData.flag).replace('<img', '<img class="aversion-flag-icon" data-flag="' + BattleLog.escapeHTML(flagData.flag) + '" style="' + style + '"');
					}
					buf += '</div></div>';
					buf += '</div>';
				}
				buf += '</div>';
			}
			// stats (JV system, no IV column)
			if (!set.jvs) set.jvs = {};
			buf += '<div class="setcol setcol-stats"><div class="setrow"><label>Stats</label><button class="textbox setstats" name="stats">';
			// Header: remove IV column entirely, rename EV -> JV
			buf += '<span class="statrow statrow-head">' +
				'<label></label><span class="statgraph"></span>' +
				'<ma></ma><ma>Base</ma>' +
				'<em></em><em></em>' +
				'<ma></ma><ma></ma><ma></ma><ma></ma><ma></ma>' +
				'<ma>' + (!isLetsGo ? 'JV' : 'AV') + '</ma>' +
				'</span>';
			var statOrder = [];
			for (var k in BattleStatNames) {
				if (k === 'spd' && this.curTeam.gen === 1) continue;
				statOrder.push(k);
			}
			var spacer = '<em></em>';
			var spacersmall = '<ma></ma>';
			var statData = {};
			var maxVal = -Infinity;
			for (var idx = 0; idx < statOrder.length; idx++) {
				var s = statOrder[idx];
				var v = this.getStat(s, set);
				statData[s] = {};
				statData[s].value = v;
				if (v > maxVal) maxVal = v;
				var baseStats = species.baseStats;
				statData[s].base = baseStats[s];
				statData[s].baseStatsBuf = '<em>' + statData[s].base + '<em></em>' + '</em>';
				// JV display (no EV 4-step logic; each point = +1 stat)
				var jv = (set.jvs[s] === undefined ? 0 : set.jvs[s]);
				var jvBuf = '<em>' + (jv ? jv : '') ;
				if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === s) jvBuf += '<small>+</small>';
				else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === s) jvBuf += '<small>&minus;</small>';
				jvBuf += '</em>';
				statData[s].jvBuf = jvBuf;
				statData[s].width = v * 90 / 504;
				var color = Math.floor(v * (s === 'hp' ? 343 : 475) / 714);
				if (color > 360) color = 360;
				if (color <= 25) color = Math.floor(color * 0.5);
				else if (color >= 300) color = Math.floor(color * 1);
				else {
					var m = 0.5 + (color - 25) * (1 - 0.5) / (300 - 25);
					color = Math.floor(color * m);
				}
				statData[s].color = color;
				statData[s].statName = this.curTeam.gen === 1 && s === 'spa' ? 'Spc' : BattleStatNames[s];
			}
			// detect whether all stats are equal; if so, don't draw borders
			var _minStat = Infinity, _maxStat = -Infinity;
			for (var kk in statData) {
				if (statData[kk].value < _minStat) _minStat = statData[kk].value;
				if (statData[kk].value > _maxStat) _maxStat = statData[kk].value;
			}
			var allEqual = (_minStat === _maxStat);
			for (var idx2 = 0; idx2 < statOrder.length; idx2++) {
				var s2 = statOrder[idx2];
				var sd = statData[s2];
				var classFrag = (sd.value === maxVal ? ' class="statbar-highest"' : '');
				buf += '<span class="statrow">' +
					'<label>' + sd.statName + '</label> ' +
					'<span class="statgraph"><span' + classFrag +
						' style="width:' + sd.width + 'px;background:' +
						((s2 === 'hp' ? sd.value >= 700 : sd.value >= 500) ? "#fff" : ('hsl(' + sd.color + ',60%,75%)')) +
						';' + ((sd.value === maxVal && !allEqual) ? 'border:1px solid #000;' : ('border-color:' + ('hsl(' + sd.color + ',60%,65%)'))) +
					'"></span></span> ' +
					spacersmall + sd.baseStatsBuf + spacer + spacer + sd.jvBuf +
				'</span>';
			}
			buf += '</button></div></div>';
			buf += '</div></li>';
			return buf;
		},
		saveImport: function () {
			var text = this.$('.teamedit textarea').val();
			var url = this.importableUrl(text);
			if (url) {
				this.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', true);
				var self = this;
				$.ajax({
					type: 'GET',
					url: url,
					success: function (data) {
						if (/^https?:\/\/pokepast\.es\/.*\/json\s*$/.test(url)) {
							var notes = data.notes.split('\n');
							if (notes[0].startsWith('Format: ')) {
								var formatid = toID(notes[0].slice(8));
								var format = window.BattleFormats && window.BattleFormats[formatid];
								if (format) self.changeFormat(format.id);
								notes.shift();
							}
							// var teamNotes = notes.join('\n'); // Not implemented yet
							var title = data.title;
							if (title && !title.startsWith('Untitled')) {
								title = title.replace(/[\|\\\/]/g, '');
								self.$('.teamnameedit').val(title).change();
							}
							Storage.activeSetList = self.curSetList = Storage.importTeam(data.paste);
						} else { Storage.activeSetList = self.curSetList = Storage.importTeam(data); }
						self.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', null);
						self.back();
					},
					error: function () {
						app.addPopupMessage("Could not fetch a team from this URL. Make sure you copied the full link, or paste the team in by hand.");
						self.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', null);
					}
				});
			} else {
				Storage.activeSetList = this.curSetList = Storage.importTeam(text);
				this.back();
			}
		},
		importableUrl: function (value) {
			var match = value.match(/^https?:\/\/(pokepast\.es|gist\.github(?:usercontent)?\.com)\/(.*)\s*$/);
			if (!match) return;
			var host = match[1];
			var path = match[2];
			switch (host) {
			case 'pokepast.es': return 'https://pokepast.es/' + path.replace(/\/.*/, '') + '/json';
			default: // gist
				var split = path.split('/');
				return split.length < 2 ? undefined : 'https://gist.githubusercontent.com/' + split[0] + '/' + split[1] + '/raw';
			}
		},
		addPokemon: function () {
			if (!this.curTeam) return;
			var team = this.curSetList;
			if (!team.length || team[team.length - 1].species) {
				var newPokemon = {
					name: '',
					species: '',
					item: '',
					nature: '',
					evs: {},
					ivs: {},
					moves: []
				};
				team.push(newPokemon);
			}
			this.curSet = team[team.length - 1];
			this.curSetLoc = team.length - 1;
			this.curChartName = '';
			this.update();
			this.$('input[name=pokemon]').select();
			var formatid = this.curTeam.format;
			if (formatid.includes('monotype') || formatid.includes('monothreat')) {
				var typeTable = [];
				var dex = this.curTeam.dex;
				if (formatid.includes('monothreat')) { typeTable = [dex.types.get(formatid.slice(14)).name || 'Normal']; }
				for (var i = 0; i < this.curSetList.length; i++) {
					var set = this.curSetList[i];
					var species = dex.species.get(set.species);
					if (species.isMega) { species = dex.species.get(species.baseSpecies); }
					if (!species.exists) continue;
					if (!formatid.includes('monothreat')) {
						if (i === 0) { typeTable = species.types; } 
						else {
							typeTable = typeTable.filter(function (type) { return species.types.includes(type); });
							if (!typeTable.length) break;
						}
					}
					if (this.curTeam.gen >= 6) {
						var item = dex.items.get(set.item);
						if (item.megaStone && species.baseSpecies === item.megaEvolves) {
							species = dex.species.get(item.megaStone);
							typeTable = typeTable.filter(function (type) { return species.types.includes(type); });
							if (!typeTable.length) break;
						}
					}
				}
				if (typeTable.length === 1) {
					this.search.engine.addFilter(['type', typeTable[0]]);
					this.search.filters = this.search.engine.filters;
					this.search.find('');
				}
			}
		},
		pastePokemon: function (i, btn) {
			if (!this.curTeam) return;
			var team = this.curSetList;
			if (team.length >= this.curTeam.capacity) return;
			if (!this.clipboardCount()) return;
			if (team.push($.extend(true, {}, this.clipboard[0])) >= 6) { $(btn).css('display', 'none'); }
			this.update();
			this.save();
		},
		saveFlag: false,
		save: function () {
			this.saveFlag = true;
			if (this.curTeam) { Storage.saveTeam(this.curTeam); }
			else { Storage.saveTeams(); }
		},
		validate: function () {
			if (this.curTeam.teamid && !this.curTeam.loaded) { return app.loadTeam(this.curTeam, this.validate.bind(this)); }
			var format = this.curTeam.format || 'gen7anythinggoes';
			if (!this.curSetList.length) {app.addPopupMessage("You need at least one Pokémon to validate.");
				return;
			}
			if (window.BattleFormats && BattleFormats[format] && BattleFormats[format].battleFormat) { format = BattleFormats[format].battleFormat; }
			app.sendTeam(this.curTeam, function () { app.send('/vtm ' + format); });
		},
		teamNameChange: function (e) {
			var name = ($.trim(e.currentTarget.value) || 'Untitled ' + (this.curTeamLoc + 1));
			if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
				app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
				name = name.replace(/[\\\/]/g, '');
			}
			if (name.indexOf('|') >= 0) {
				app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
				name = name.replace(/\|/g, '');
			}
			if (name.indexOf('[') >= 0 || name.indexOf(']') >= 0) {
				app.addPopupMessage("Names can't contain the characters [ or ], since they're used for storing team IDs.");
				name = name.replace(/\[/g, '');
				name = name.replace(/\]/g, '');
			}
			this.curTeam.name = name;
			e.currentTarget.value = name;
			this.save();
		},
		format: function (format, button) { if (!window.BattleFormats) { return; }
			var self = this;
			app.addPopup(FormatPopup, { format: format, sourceEl: button, selectType: 'teambuilder', onselect: function (newFormat) { self.changeFormat(newFormat); } });
		},
		changeFormat: function (format) {
			this.curTeam.format = format;
			this.curTeam.gen = this.getGen(this.curTeam.format);
			this.curTeam.dex = Dex.forGen(this.curTeam.gen);
			if (this.curTeam.format.includes('letsgo')) { this.curTeam.dex = Dex.mod('gen7letsgo'); }
			if (this.curTeam.format.includes('bdsp')) { this.curTeam.dex = Dex.mod('gen8bdsp'); }
			if (this.curTeam.format.includes('indigostarstorm') || this.curTeam.format.toLowerCase().includes('isl')) 
				{ this.curTeam.dex = Dex.mod('gen9indigostarstorm'); }
		// Update capacity for Indigo Starstorm
		if (this.curTeam.capacity !== 24 && this.curTeam.capacity !== 50) {
			if (format.includes('indigostarstorm') || format.includes('isl')) { this.curTeam.capacity = 10; } 
			else { this.curTeam.capacity = 6; }
		}
		this.save();
			if (this.curTeam.gen === 5 && !Dex.loadedSpriteData['bw']) Dex.loadSpriteData('bw');
			this.update();
		},
		nicknameChange: function (e) {
			var i = +$(e.currentTarget).closest('li').attr('value');
			var set = this.curSetList[i];
			var name = $.trim(e.currentTarget.value).replace(/\|/g, '');
			e.currentTarget.value = set.name = name;
			this.save();
		},
		getScaledTeambuilderSpriteStyle: function (set) {
		// Base sprite CSS (image + default positioning) from PS/Dex
		var css = Dex.getTeambuilderSprite(set, this.curTeam.dex) || '';
		// Ensure css ends with a semicolon so concatenation can't break
		css = css.trim();
		if (css && css[css.length - 1] !== ';') css += ';';
		// REMOVE anything that would fight us
		// (Dex sometimes outputs background-position, or background-position-x/y, and background-size)
		css = css
			.replace(/background-position\s*:[^;]*;?/ig, '')
			.replace(/background-position-x\s*:[^;]*;?/ig, '')
			.replace(/background-position-y\s*:[^;]*;?/ig, '')
			.replace(/background-size\s*:[^;]*;?/ig, '')
			.replace(/background-repeat\s*:[^;]*;?/ig, '');
		// Size tier -> 10% scale per step (XS..XL)
		var size = set.size || 'M';
		var tierMap = {XS: -2, S: -1, M: 0, L: 1, XL: 2};
		var tier = (tierMap[size] !== undefined) ? tierMap[size] : 0;
		var basePx = 96;
		var spritePx = Math.round(basePx * (1 + tier * 0.10));
		// Treat the sprite as living in a fixed 96x96 "frame" whose top-left is (baseX, baseY)
		// These match what your UI is already laid out for.
		var baseX = 5;
		var baseY = 0;
		var delta = Math.round((basePx - spritePx) / 2);
		var spriteX = baseX + delta;  
		var spriteY = baseY + delta; 
		return css +
		'background-position:' + spriteX + 'px ' + spriteY + 'px; ' +
		'background-position-x:' + spriteX + 'px; ' +
		'background-position-y:' + spriteY + 'px; ' +
		'background-size:' + spritePx + 'px ' + spritePx + 'px; ' +
		'background-repeat:no-repeat; ' +
		'overflow:hidden;';
	},
	shinyChange: function (e) {
		var $target = $(e.currentTarget);
		var $li = $target.closest('li');
		var set, $scope;
		if ($li.length) {
			var i = +$li.attr('value');
			set = this.curSetList[i];
			$scope = $li;
		} else {
			set = this.curSet;
			$scope = this.$el;
		}
		if (!set) return;
		if ($target.is(':checked')) set.shiny = true;
		else delete set.shiny;
		this.save();
		var $setchart = $scope.find('.setchart').first();
		if ($setchart.length) $setchart.attr('style', this.getScaledTeambuilderSpriteStyle(set));
	},
	sizeChange: function (e) {
		var $target = $(e.currentTarget);
		// Works in BOTH contexts:
		// 1) Team list: inside <li value="i">
		// 2) Focused/main panel: no <li>, use this.curSet
		var $li = $target.closest('li');
		var set, $scope;
		if ($li.length) {
			var i = +$li.attr('value');
			set = this.curSetList[i];
			$scope = $li;
		} else {
			set = this.curSet;
			$scope = this.$el; // search within the main panel
		}
		if (!set) return;
		var size = $target.val();
		if (!size || !['XS', 'S', 'M', 'L', 'XL'].includes(size)) return;
		// Persist size
		if (size !== 'M') set.size = size;
		else delete set.size;
		this.save();
		// Update height/weight display (same math you already use)
		var species = this.curTeam.dex.species.get(set.species);
		var baseWeight = species.weightkg || 0;
		var baseHeight = species.heightm || 0;
		var sizeWeightModifier = (species.sizeWeightModifier !== undefined ? species.sizeWeightModifier : 0.1);
		var sizeTiers = {XS: -2, S: -1, M: 0, L: 1, XL: 2}[size] || 0;
		var modifiedWeight = baseWeight * (1 + (sizeTiers * sizeWeightModifier));
		var modifiedHeight = baseHeight * (1 + (sizeTiers * sizeWeightModifier));
		$scope.find('.height-display').first().text(modifiedHeight.toFixed(1) + ' m');
		$scope.find('.weight-display').first().text(modifiedWeight.toFixed(1) + ' kg');
		// Reapply sprite style (this is the scaling feature)
		var $setchart = $scope.find('.setchart').first();
		if ($setchart.length) $setchart.attr('style', this.getScaledTeambuilderSpriteStyle(set));
	},
	// clipboard
	clipboard: [],
	clipboardCount: function () { return this.clipboard.length; },
	clipboardVisible: function () { return !!this.clipboardCount(); },
	clipboardHTML: function () {
		var buf = '';
		buf += '<div class="teambuilder-clipboard-container" style="display: ' + (this.clipboardVisible() ? 'block' : 'none') + ';">';
		buf += '<div class="teambuilder-clipboard-title">Clipboard:</div>';
		buf += '<div class="teambuilder-clipboard-data" tabindex="-1">' + this.clipboardInnerHTML() + '</div>';
		buf += '<div class="teambuilder-clipboard-buttons">';
		if (this.curTeam && this.curSetList.length < this.curTeam.capacity) { buf += '<button name="pastePokemon" class="teambuilder-clipboard-button-left button"><i class="fa fa-clipboard"></i> Paste!</button>'; }
		buf += '<button name="clipboardRemoveAll" class="teambuilder-clipboard-button-right button"><i class="fa fa-trash"></i> Clear clipboard</button>';
		buf += '</div>';
		buf += '</div>';
		return buf;
	},
	clipboardInnerHTMLCache: '',
	clipboardInnerHTML: function () {
		if (this.clipboardInnerHTMLCache) { return this.clipboardInnerHTMLCache; }
		var buf = '';
		for (var i = 0; i < this.clipboardCount(); i++) {
			var res = this.clipboard[i];
			var species = Dex.species.get(res.species);
			buf += '<div class="result" data-id="' + i + '">';
			buf += '<div class="section"><span class="icon" style="' + Dex.getPokemonIcon(species.name) + '"></span>';
			buf += '<span class="species">' + (species.name === species.baseSpecies ? BattleLog.escapeHTML(species.name) : (BattleLog.escapeHTML(species.baseSpecies) + '-<small>' + BattleLog.escapeHTML(species.name.substr(species.baseSpecies.length + 1)) + '</small>')) + '</span></div>';
			buf += '<div class="section"><span class="ability-item">' + (BattleLog.escapeHTML(res.ability) || '<i>No ability</i>') + '<br />' + (BattleLog.escapeHTML(res.item) || '<i>No item</i>') + '</span></div>';
			buf += '<div class="section no-border">';
			for (var j = 0; j < 4; j++) {
				if (!(j & 1)) { buf += '<span class="moves">'; }
				buf += (BattleLog.escapeHTML(res.moves[j]) || '<i>No move</i>') + (!(j & 1) ? '<br />' : '');
				if (j & 1) { buf += '</span>'; }
			}
			buf += '</div>';
			buf += '</div>';
		}
		this.clipboardInnerHTMLCache = buf;
		return buf;
	},
	clipboardUpdate: function () {
		this.clipboardInnerHTMLCache = '';
		$('.teambuilder-clipboard-data').html(this.clipboardInnerHTML());
	},
	clipboardExpanded: false,
	clipboardExpand: function () {
		var $clipboard = $('.teambuilder-clipboard-data');
		$clipboard.animate({ height: this.clipboardCount() * 34 }, 500, function () { setTimeout(function () { $clipboard.focus(); }, 100); });
		setTimeout(function () { this.clipboardExpanded = true; }.bind(this), 10);
	},
	clipboardShrink: function () {
		var $clipboard = $('.teambuilder-clipboard-data');
		$clipboard.animate({ height: 32 }, 500);
		setTimeout(function () { this.clipboardExpanded = false; }.bind(this), 10);
	},
	clipboardResultSelect: function (e) {
		if (!this.clipboardExpanded) return;
		e.preventDefault();
		e.stopPropagation();
		var target = +($(e.target).closest('.result').data('id'));
		if (target === -1) {
			this.clipboardShrink();
			this.clipboardRemoveAll();
			return;
		}
		this.clipboard.unshift(this.clipboard.splice(target, 1)[0]);
		this.clipboardUpdate();
		this.clipboardShrink();
	},
	clipboardAdd: function (set) {
		if (this.clipboard.unshift(set) > 6) { this.clipboard.pop(); }
		this.clipboardUpdate();
		if (this.clipboardCount() === 1) {
			var $clipboard = $('.teambuilder-clipboard-container').css('opacity', 0);
			$clipboard.slideDown(250, function () { $clipboard.animate({ opacity: 1 }, 250); });
		}
	},
	clipboardRemoveAll: function () {
		this.clipboard = [];
		var self = this;
		var $clipboard = $('.teambuilder-clipboard-container');
		$clipboard.animate({ opacity: 0 }, 250, function () { $clipboard.slideUp(250, function () { self.clipboardUpdate(); }); });
	},
	// copy/import/export/move/delete
	copySet: function (i, button) {
		i = +($(button).closest('li').attr('value'));
		this.clipboardAdd($.extend(true, {}, this.curSetList[i]));
		button.blur();
	},
	wasViewingPokemon: false,
	importSet: function (i, button) {
		i = +($(button).closest('li').attr('value'));
		this.wasViewingPokemon = true;
		if (!this.curSet) {
			this.wasViewingPokemon = false;
			this.selectPokemon(i);
		}
		this.$('li').find('input, button').prop('disabled', true);
		this.$chart.hide();
		this.$('.teambuilder-pokemon-import')
		.show()
		.find('textarea')
		.val(Storage.exportTeam([this.curSet], this.curTeam.gen).trim())
		.focus()
		.select();
		this.getSmogonSets();
	},
	getSmogonSets: function () {
		this.$('.teambuilder-pokemon-import .teambuilder-import-smogon-sets').empty();
		this.$('.teambuilder-pokemon-import .teambuilder-import-user-sets').empty();
		var format = this.curTeam.format;
		// If we don't have a specific format, don't try and guess which sets to use.
		if (format.match(/gen\d$/)) return;
		var self = this;
		this.smogonSets = this.smogonSets || {};
		this.updateCachedUserSets(format);
		this.importSetButtons();
		if (this.smogonSets[format] !== undefined) { return; }
		// We fetch this as 'text' and JSON.parse it ourserves in order to have consistent behavior between the localdev CORS helper and the real jQuery.get function, which would already parse this into an object based on the content-type header.
		$.get('https://' + Config.routes.client + '/data/sets/' + format + '.json', {}, function (data) {
			try { self.smogonSets[format] = JSON.parse(data); } 
			catch (e) { self.smogonSets[format] = false; } // An error occured. Mark this as false, so that we don't try to reimport sets for this format in the future.
			self.importSetButtons();
		}, 'text');
	},
	updateCachedUserSets: function (format) {
		if (this.userSets && this.userSets[format]) return;
		this.userSets = this.userSets || {};
		this.userSets[format] = {};
		var duplicateNameIndices = {};
		for (var i = 0; i < teams.length; i++) {
			var team = teams[i];
			if (team.format !== format || team.capacity !== 24) continue;
			var setList = Storage.unpackTeam(team.team);
			for (var j = 0; j < setList.length; j++) {
				var set = setList[j];
				var name = set.name + " " + (duplicateNameIndices[set.name] || "");
				var sets = this.userSets[format][set.species] || {};
				sets[name] = set;
				this.userSets[format][set.species] = sets;
				duplicateNameIndices[set.name] = 1 + (duplicateNameIndices[set.name] || 0);
			}
		}
	},
	clearCachedUserSetsIfNecessary: function (format) {
		if (!this.curTeam || !this.userSets) return;
		// clear cached user sets if we have just been in a box for given format
		if (this.curTeam.capacity === 24 && this.userSets[format]) { this.userSets[format] = undefined; }
	},
		importSetButtons: function () {
			var format = this.curTeam.format;
			var smogonFormatSets = this.smogonSets[format];
			var userFormatSets = this.userSets[format];
			var species = this.curSet.species;
			var $smogonSetDiv = this.$('.teambuilder-pokemon-import .teambuilder-import-smogon-sets');
			$smogonSetDiv.empty();
			var $userSetDiv = this.$('.teambuilder-pokemon-import .teambuilder-import-user-sets');
			$userSetDiv.empty();
			if (smogonFormatSets && smogonFormatSets['dex']) {
				var smogonSets = $.extend({}, smogonFormatSets['dex'][species], (smogonFormatSets['stats'] || {})[species]);
				$smogonSetDiv.text('Sample sets: ');
				for (var set in smogonSets) { $smogonSetDiv.append('<button name="importSmogonSet" class="button smogon">' + BattleLog.escapeHTML(set) + '</button>'); }
				$smogonSetDiv.append(' <small>(<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small>');
			}
			$userSetDiv.text('Box sets: ');
			if (userFormatSets && userFormatSets[species]) { for (var set in userFormatSets[species]) { $userSetDiv.append('<button name="importSmogonSet" class="button box">' + BattleLog.escapeHTML(set) + '</button>'); } } 
			else { $userSetDiv.append('<small>(Sets from your boxes in this format will be available here)</small>'); }
		},
		importSmogonSet: function (i, button) {
			var species = this.curSet.species;
			var setName = this.$(button).text();
			var sampleSet;
			if (this.$(button).hasClass('smogon')) {
				var smogonFormatSets = this.smogonSets[this.curTeam.format];
				sampleSet = smogonFormatSets['dex'][species][setName] || smogonFormatSets['stats'][species][setName];
			}
			if (this.$(button).hasClass('box')) {
				var userFormatSets = this.userSets[this.curTeam.format];
				sampleSet = userFormatSets[species][setName];
			}
			if (!sampleSet) return;
			var curSet = $.extend({}, this.curSet, sampleSet);
			// smogon samples don't usually have sample names, box samples usually do; either way, don't use them
			curSet.name = this.curSet.name || undefined;
			// never preserve current set tera, even if smogon set used default
			if (this.curSet.gen === 9) { curSet.teraType = sampleSet.teraType || species.requiredTeraType || species.types[0]; }
			var text = Storage.exportTeam([curSet], this.curTeam.gen);
			this.$('.teambuilder-pokemon-import .pokemonedit').val(text);
		},
		closePokemonImport: function (force) {
			if (!this.wasViewingPokemon) return this.back();
			var $li = this.$('li');
			var i = +($li.attr('value'));
			this.$('.teambuilder-pokemon-import').hide();
			this.$chart.show();
			if (force === true) return this.selectPokemon(i);
			$li.find('input, button').prop('disabled', false);
		},
		savePokemonImport: function (i) {
			i = +(this.$('li').attr('value'));
			var curSet = Storage.importTeam(this.$('.pokemonedit').val())[0];
			if (curSet) {
				this.curSet = curSet;
				this.curSetList[i] = curSet;
			}
			this.closePokemonImport(true);
		},
		moveSet: function (i, button) {
			i = +($(button).closest('li').attr('value'));
			app.addPopup(MoveSetPopup, { i: i, team: this.curSetList });
		},
		deleteSet: function (i, button) {
			i = +($(button).closest('li').attr('value'));
			this.deletedSetLoc = i;
			this.deletedSet = this.curSetList.splice(i, 1)[0];
			if (this.curSet) { this.addPokemon(); } 
			else { this.update(); }
			this.save();
		},
		undeleteSet: function () {
			if (this.deletedSet) {
				var loc = this.deletedSetLoc;
				this.curSetList.splice(loc, 0, this.deletedSet);
				this.deletedSet = null;
				this.deletedSetLoc = -1;
				this.save();
				if (this.curSet) {
					this.curSetLoc = loc;
					this.curSet = this.curSetList[loc];
					this.curChartName = '';
					this.update();
					this.updateChart();
				} else { this.update(); }
			}
		},
		//region Set view
		updateSetView: function () {
			// pokemon
			var buf = '<div class="pad">';
			buf += '<button name="back" class="button"><i class="fa fa-chevron-left"></i> Team</button></div>';
			buf += '<div class="teambar">';
			buf += this.renderTeambar();
			buf += '</div>';
			// pokemon
			buf += '<div class="teamchartbox individual">';
			buf += '<ol class="teamchart">';
			buf += this.renderSet(this.curSet, this.curSetLoc);
			buf += '</ol>';
			buf += '</div>';
			// results
			this.chartPrevSearch = '[init]';
			buf += '<div class="teambuilder-results"></div>';
			// import/export
			buf += '<div class="teambuilder-pokemon-import">';
			buf += '<div class="pokemonedit-buttons"><button name="closePokemonImport" class="button"><i class="fa fa-chevron-left"></i> Back</button> <button name="savePokemonImport" class="button"><i class="fa fa-floppy-o"></i> Save</button></div>';
			buf += '<textarea class="pokemonedit textbox" rows="14"></textarea>';
			buf += '<div class="teambuilder-import-smogon-sets"></div>';
			buf += '<div class="teambuilder-import-user-sets"></div>';
			buf += '</div>';
			this.$el.html('<div class="teamwrapper">' + buf + '</div>');
			if ($(window).width() < 640) this.show();
			this.$chart = this.$('.teambuilder-results');
			this.search = new BattleSearch(this.$chart, this.$chart);
			var self = this;
			// fun fact: Backbone DOM events don't support scroll... I guess scroll doesn't bubble like other events
			this.$chart.on('scroll', function () { if (self.curChartType in self.searchChartTypes) { self.search.updateScroll(); } });
		},
		updateSetTop: function () {
			this.$('.teambar').html(this.renderTeambar());
			this.$('.teamchart').first().html(this.renderSet(this.curSet, this.curSetLoc));
		},
		renderTeambar: function () {
			var buf = '';
			var isAdd = false;
			if (this.curSetList.length && !this.curSetList[this.curSetList.length - 1].species && this.curSetLoc !== this.curSetList.length - 1) { this.curSetList.splice(this.curSetList.length - 1, 1); }
			// if in a box, try to show at least 2 and up to 4 other pokemon in each direction but don't step outside the array bounds (obviously)
			var start = 0;
			var end = this.curSetList.length;
			if (end > 10 || (end > 6 && this.curTeam.capacity > 10)) {
				start = this.curSetLoc - 2;
				if (start < 0) start = 0;
				if (start + 5 > end) start = end - 5;
				end = start + 5;
			}
			for (var i = start; i < end; i++) {
				var set = this.curSetList[i];
				var pokemonicon = '<span class="picon pokemonicon-' + i + '" style="' + Dex.getPokemonIcon(set) + '"></span>';
				if (!set.species) {
					buf += '<button disabled class="addpokemon" aria-label="Add Pok&eacute;mon"><i class="fa fa-plus"></i></button> ';
					isAdd = true;
				} else if (i === this.curSetLoc) { buf += '<button disabled class="pokemon">' + pokemonicon + BattleLog.escapeHTML(set.name || this.curTeam.dex.species.get(set.species).baseSpecies || '<i class="fa fa-plus"></i>') + '</button> '; } 
				else { buf += '<button name="selectPokemon" value="' + i + '" class="pokemon">' + pokemonicon + BattleLog.escapeHTML(set.name || this.curTeam.dex.species.get(set.species).baseSpecies) + '</button> '; }
			}
			if (this.curSetList.length < this.curTeam.capacity && !isAdd) { buf += '<button name="addPokemon"><i class="fa fa-plus"></i></button> '; }
			return buf;
		},
		updatePokemonSprite: function () {
			var set = this.curSet;
			if (!set) return;
			this.$('.setchart').attr('style', this.getScaledTeambuilderSpriteStyle(set));
			this.$('.pokemonicon-' + this.curSetLoc).css('background', Dex.getPokemonIcon(set).substr(11));
			var item = this.curTeam.dex.items.get(set.item);
			if (item.id) { this.$('.setcol-details .itemicon').css('background', Dex.getItemIcon(item).substr(11)); } 
			else { this.$('.setcol-details .itemicon').css('background', 'none'); }
			this.updateStatGraph();
		},
		updateStatGraph: function () {
	var set = this.curSet;
	if (!set) return;

	// JVs live here
	if (!set.jvs) set.jvs = {};

	var stats = { hp: '', atk: '', def: '', spa: '', spd: '', spe: '' };
	var supportsEVs = !this.curTeam.format.includes('letsgo'); // keep the existing letsgo behavior if you want
	// species is needed for base stat lookups in the stat HTML below
	var species = this.curTeam.dex.species.get(set.species);

	// stat cell (HEADER) — replace EV->JV and REMOVE the IV column entirely
	var buf =
		'<span class="statrow statrow-head">' +
			'<label></label>' +
			'<span class="statgraph"></span>' +
			'<ma></ma><ma>Base</ma>' +
			'<em></em><em></em>' +
			'<ma></ma><ma></ma><ma></ma><ma></ma><ma></ma>' +
			'<ma>' + (supportsEVs ? 'JV' : 'AV') + '</ma>' +
			'<ma></ma><ma></ma>' +
		'</span>';

	// JV defaults: 0
	var defaultJV = 0;

	// build a stat list, find the highest, then render with a special class for it
	var statList = [];
	var maxVal = -Infinity;
	var minVal = Infinity;

	for (var s in stats) {
		if (s === 'spd' && this.curTeam.gen === 1) continue;
		var v = this.getStat(s, set);
		stats[s] = v;
		statList.push(s);
		if (v > maxVal) maxVal = v;
		if (v < minVal) minVal = v;
	}

	var allEqual = (minVal === maxVal);

	for (var ii = 0; ii < statList.length; ii++) {
		var st = statList[ii];

		// Use JVs (NOT EVs)
		var jv = (set.jvs[st] === undefined ? defaultJV : set.jvs[st]);

		var jvBuf = '<em' + (jv !== defaultJV && jv >= 100 ? ' class="ev-3"' : '') + '>' + (jv === defaultJV ? '' : jv);
		if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === st) jvBuf += '<small>+</small>';
		else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === st) jvBuf += '<small>&minus;</small>';
		jvBuf += '</em>';

		var width = stats[st] * 90 / 504;
		var color = Math.floor(stats[st] * (st === 'hp' ? 343 : 475) / 714);
		if (color > 360) color = 360;
		if (color <= 25) color = Math.floor(color * 0.5);
		else if (color >= 300) color = Math.floor(color * 1);
		else {
			var m = 0.5 + (color - 25) * (1 - 0.5) / (300 - 25);
			color = Math.floor(color * m);
		}

		var statName = this.curTeam.gen === 1 && st === 'spa' ? 'Spc' : BattleStatNames[st];
		var classFrag = (stats[st] === maxVal ? ' class="statbar-highest"' : '');

		// ROW — remove IV cell at the end (do NOT append any ivBuf)
		buf +=
			'<span class="statrow">' +
				'<label>' + statName + '</label> ' +
				'<span class="statgraph"><span' + classFrag +
					' style="width:' + width + 'px;background:' +
					((st === 'hp' ? stats[st] > 699 : stats[st] > 499) ? "#fff" : ('hsl(' + color + ',40%,75%)')) +
					';' + ((stats[st] === maxVal && !allEqual) ? 'border:1px solid #000;' : ('border-color:' + ('hsl(' + color + ',40%,65%)'))) +
				'"></span></span> ' +
				'<ma></ma>' +
				('<em>' + (species && species.baseStats ? species.baseStats[st] : '') + '<em></em>' + '</em>') +
				'<em></em><em></em>' +
				jvBuf +
			'</span>';
	}

	this.$('button[name=stats]').html(buf);
	if (this.curChartType !== 'stats') return;

	// left stats column (numbers)
	buf = '<div></div>';
	for (var stat in stats) {
		if (stat === 'spd' && this.curTeam.gen === 1) continue;
		buf += '<div><b>' + stats[stat] + '</b></div>';
	}
	this.$chart.find('.statscol').html(buf);

	// right graph column + Remaining
	buf = '<div></div>';
	var totalJV = 0;

	for (var stat2 in stats) {
		if (stat2 === 'spd' && this.curTeam.gen === 1) continue;

		var w = stats[stat2] * 180 / 504;
		var c = Math.floor(stats[stat2] * (stat2 === 'hp' ? 343 : 475) / 714);
		if (c > 360) c = 360;
		if (c <= 25) c = Math.floor(c * 0.5);
		else if (c >= 300) c = Math.floor(c * 1);
		else {
			var m2 = 0.5 + (c - 25) * (1 - 0.5) / (300 - 25);
			c = Math.floor(c * m2);
		}

		buf += '<div><em><span style="width:' + Math.floor(w) + 'px;background:' +
			((stat2 === 'hp' ? stats[stat2] > 699 : stats[stat2] > 499) ? "#fff" : ('hsl(' + c + ',85%,45%)')) +
			';"></span></em></div>';

		totalJV += (set.jvs[stat2] || 0);
	}

	if (this.curTeam.gen > 2 && supportsEVs) buf += '<div><em>Remaining:</em></div>';
	this.$chart.find('.graphcol').html(buf);

	if (this.curTeam.gen <= 2) return;

	// Remaining for JVs (TOTAL = 130)
	if (supportsEVs) {
		var maxJV = 130;
		if (totalJV <= maxJV) this.$chart.find('.totalev').html('<em>' + (maxJV - totalJV) + '</em>');
		else this.$chart.find('.totalev').html('<b>' + (maxJV - totalJV) + '</b>');
	}

	this.$chart.find('select[name=nature]').val(set.nature || 'Serious');
},

		curChartType: '',
		curChartName: '',
		searchChartTypes: {
			pokemon: 'pokemon',
			ability: 'abilities',
			move: 'moves',
			item: 'items',
			flag: 'flag',
		},
		isDualAbilityFormat: function () {
  			var f = (this.curTeam && this.curTeam.format) || '';
  			f = ('' + f).toLowerCase();
  			return f.includes('indigostarstorm') || f.includes('isl');
		},
		updateChart: function (pokemonChanged, wasIncomplete) {
			var type = this.curChartType;
			if (type === 'stats') {
				this.search.qType = null;
				this.search.qName = null;
				this.updateStatForm();
				return;
			}
			if (type === 'details') {
				this.search.qType = null;
				this.search.qName = null;
				this.updateDetailsForm();
				return;
			}
			if (type === 'ability') {
  				this.search.qType = null;
  				this.search.qName = null;
  				this.updateAbilitySetsForm();
  				return;
			}
			var $inputEl = this.$('input[name=' + this.curChartName + ']');
			var q = $inputEl.val();
			if (pokemonChanged || this.search.qName !== this.curChartName) {
				var cur = {};
				cur[toID(q)] = 1; // make sure selected one is first
				if (type === 'move') {
					cur[toID(this.$('input[name=move1]').val())] = 1;
					cur[toID(this.$('input[name=move2]').val())] = 1;
					cur[toID(this.$('input[name=move3]').val())] = 1;
					cur[toID(this.$('input[name=move4]').val())] = 1;
				}
				if (type !== this.search.qType) { this.$chart.scrollTop(0); }
				this.search.$inputEl = $inputEl;
				this.search.setType(type, this.curTeam.format || 'gen9', this.curSet, cur);
				this.qInitial = q;
				this.search.qName = this.curChartName;
				if (wasIncomplete) { if (this.search.find(q)) { if (this.search.q) this.$chart.find('a').first().addClass('hover'); } }
			} else if (q !== this.qInitial) {
				this.qInitial = undefined;
				if (this.search.find(q)) { if (this.search.q) this.$chart.find('a').first().addClass('hover'); }
			}
		},
		selectPokemon: function (i) {
			i = +i;
			var set = this.curSetList[i];
			if (set) {
				this.curSet = set;
				this.curSetLoc = i;
				if (!this.curChartName) {
					this.curChartName = 'details';
					this.curChartType = 'details';
				}
				if (this.curChartType in this.searchChartTypes) {
					this.update();
					this.updateChart(true);
					this.$('input[name=' + this.curChartName + ']').select();
				} else {
					this.update();
					this.updateChart(true);
				}
			}
		},
		stats: function (i, button) {
			if (!this.curSet) this.selectPokemon($(button).closest('li').val());
			this.curChartName = 'stats';
			this.curChartType = 'stats';
			this.updateChart();
		},
		details: function (i, button) {
			if (!this.curSet) this.selectPokemon($(button).closest('li').val());
			this.curChartName = 'details';
			this.curChartType = 'details';
			this.updateChart();
		},


		
		//region Set stat form
		plus: '',
		minus: '',
		smogdexLink: function (s) {
			var species = this.curTeam.dex.species.get(s);
			var format = this.curTeam && this.curTeam.format;
			var smogdexid = toID(species.baseSpecies);
			if (species.id === 'meowstic') { smogdexid = 'meowstic-m'; } 
			else if (species.forme) {
				switch (species.baseSpecies) {
				case 'Alcremie':
				case 'Basculin':
				case 'Burmy':
				case 'Castform':
				case 'Cherrim':
				case 'Deerling':
				case 'Flabebe':
				case 'Floette':
				case 'Florges':
				case 'Furfrou':
				case 'Gastrodon':
				case 'Genesect':
				case 'Keldeo':
				case 'Mimikyu':
				case 'Minior':
				case 'Pikachu':
				case 'Polteageist':
				case 'Sawsbuck':
				case 'Shellos':
				case 'Sinistea':
				case 'Tatsugiri':
				case 'Vivillon':
					break;
				default:
					smogdexid += '-' + toID(species.forme);
					break;
				}
			}
			var generationNumber = 9;
			if (format.substr(0, 3) === 'gen') {
				var number = parseInt(format.charAt(3), 10);
				if (1 <= number && number <= 8) { generationNumber = number; }
				format = format.substr(4);
			}
			var generation = ['rb', 'gs', 'rs', 'dp', 'bw', 'xy', 'sm', 'ss', 'sv'][generationNumber - 1];
			if (format === 'battlespotdoubles') { smogdexid += '/vgc15'; } 
			else if (format === 'doublesou' || format === 'doublesuu') { smogdexid += '/doubles'; } 
			else if (format === 'ou' || format === 'uu' || format === 'ru' || format === 'nu' || format === 'pu' || format === 'lc' || format === 'monotype' || format === 'mixandmega' || format === 'nfe' || format === 'nationaldex' || format === 'stabmons' || format === '1v1' || format === 'almostanyability') { smogdexid += '/' + format; } 
			else if (format === 'balancedhackmons') { smogdexid += '/bh'; } 
			else if (format === 'anythinggoes') { smogdexid += '/ag'; } 
			else if (format === 'nationaldexag') {  smogdexid += '/national-dex-ag'; }
			return 'http://smogon.com/dex/' + generation + '/pokemon/' + smogdexid + '/';
		},
		updateAbilitySetsForm: function () {
  var set = this.curSet;
  if (!set) return;

  var dex = this.curTeam.dex;
  var format = (this.curTeam && this.curTeam.format) || '';
  var isISL = (format.includes('indigostarstorm') || format.toLowerCase().includes('isl'));

  // Always use the CURRENT TEAM DEX (modded when in ISL) to decide ability sets.
  var species = dex.species.get(set.species);
  var abilTable = (species && species.abilities) || {};

  // In ISL: interpret abilities as 2 "ability sets":
  //   set1: 0/1
  //   set2: H/S
  // Outside ISL: keep vanilla behavior (just ability/ability2 fields as-is).
  if (!isISL) {
    var abil1 = set.ability || '';
    var abil2 = set.ability2 || '';

    var buf = '';
    buf += '<div class="resultheader"><h3>Abilities</h3></div>';
    buf += '<ul class="utilichart">';

    function renderAbilityRow(name) {
      if (!name) return '';
      var id = toID(name);
      var ability = dex.abilities.get(name);
      var desc = (BattleAbilities[id] && BattleAbilities[id].shortDesc) || ability.shortDesc || '';
      return (
        '<li class="result abilityrow">' +
          '<a class="cur" data-entry="ability|' + BattleLog.escapeHTML(name) + '">' +
            '<span class="col namecol">' + BattleLog.escapeHTML(ability.name || name) + '</span> ' +
            '<span class="col abilitydesccol">' + BattleLog.escapeHTML(desc) + '</span>' +
          '</a>' +
        '</li>'
      );
    }

    buf += renderAbilityRow(abil1);
    if (abil2 && abil2 !== abil1) buf += renderAbilityRow(abil2);

    buf += '</ul>';
    this.$chart.html(buf);

    this.$('input[name=ability]').val(abil1);
    this.$('input[name=ability2]').val(abil2);
    return;
  }

  // --- ISL mode ---
  // Build sets from species ability table (0/1 and H/S).
  function cleanAbilityName(x) {
    if (!x) return '';
    if (typeof x !== 'string') return '';
    if (x === 'None') return '';
    return x;
  }

  var set1 = [cleanAbilityName(abilTable['0']), cleanAbilityName(abilTable['1'])].filter(Boolean);
  var set2 = [cleanAbilityName(abilTable['H']), cleanAbilityName(abilTable['S'])].filter(Boolean);

  // Decide if Set 2 exists (any H/S ability)
  var hasSet2 = !!set2.length;

  // Ensure we have a valid abilitySet value (1 or 2)
  var curSetNum = (set.abilitySet === 2 || set.abilitySet === '2') ? 2 : 1;
  if (!hasSet2) curSetNum = 1;

  // If stored abilities don't match the selected set, sync them from the species table.
  // This guarantees both slots update together.
  function applySetNum(n) {
    var chosen = (n === 2 ? set2 : set1);
    set.abilitySet = n;
    set.ability = chosen[0] || '';
    set.ability2 = chosen[1] || '';
    // keep left-panel inputs in sync
    this.$('input[name=ability]').val(set.ability);
    this.$('input[name=ability2]').val(set.ability2);
    // update the visible set number control if it exists
    this.$('input[name=abilitySet]').val('' + n);
    this.$('button[name=abilitySetToggle]').text('' + n);
  }

  // If the current set doesn't match species table (or is empty), fix it.
  var expected = (curSetNum === 2 ? set2 : set1);
  var mismatch =
    (set.ability || '') !== (expected[0] || '') ||
    (set.ability2 || '') !== (expected[1] || '');

  if (mismatch) applySetNum.call(this, curSetNum);

  // Render chart: show BOTH sets; clicking selects the whole set.
  var buf = '';
  buf += '<div class="resultheader"><h3>Abilities</h3></div>';
  buf += '<ul class="utilichart">';

  function renderAbilityRow(name, setNum) {
    if (!name) return '';
    var id = toID(name);
    var ability = dex.abilities.get(name);
    var desc = (BattleAbilities[id] && BattleAbilities[id].shortDesc) || ability.shortDesc || '';
    var curClass = (set.abilitySet === setNum) ? 'cur' : '';
    return (
      '<li class="result abilityrow">' +
        '<a class="' + curClass + '" data-entry="ability|' + BattleLog.escapeHTML(name) + '" data-abilityset="' + setNum + '">' +
          '<span class="col namecol">' + BattleLog.escapeHTML(ability.name || name) + '</span> ' +
          '<span class="col abilitydesccol">' + BattleLog.escapeHTML(desc) + '</span>' +
        '</a>' +
      '</li>'
    );
  }

  buf += '<li class="result"><h3 style="margin:6px 0">Set 1</h3></li>';
  if (set1.length) {
    for (var i = 0; i < set1.length; i++) buf += renderAbilityRow(set1[i], 1);
  } else {
    buf += '<li class="result"><em>(none)</em></li>';
  }

  if (hasSet2) {
    buf += '<li class="result"><h3 style="margin:10px 0 6px">Set 2</h3></li>';
    for (var j = 0; j < set2.length; j++) buf += renderAbilityRow(set2[j], 2);
  }

  buf += '</ul>';
  this.$chart.html(buf);

  // Also keep the visible "Ability Set" number correct.
  // (Your UI shows it next to Ability Set in the left panel.)
  this.$('button[name=abilitySetToggle]').text('' + (set.abilitySet || 1));
},
		updateStatForm: function (setGuessed) {
	var buf = '';
	var set = this.curSet;
	if (!set) return;

	if (!set.jvs) set.jvs = {};

	var species = this.curTeam.dex.species.get(set.species);
	var baseStats = species.baseStats;

	// JV header
	buf += '<div class="resultheader"><h3>JVs</h3></div>';
	buf += '<div class="statform">';

	// ---- Keep the existing guesser UI (but apply it as JVs and clamp to 64/130) ----
	var guess = new BattleStatGuesser(this.curTeam.format).guess(set);
	var role = guess.role;
	var guessed = guess.evs; // yes, the guesser returns "evs" — we treat them as a suggestion source
	var guessedPlus = guess.plusStat;
	var guessedMinus = guess.minusStat;

	buf += '<p class="suggested"><small>Guessed spread:';
	if (role === '?') {
		buf += ' (Please choose 4 moves to get a guessed spread) (<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small></p>';
	} else {
		buf += ' </small><button name="setStatFormGuesses" class="button">' + role + ': ';
		for (var i in BattleStatNames) {
			if (guessed[i]) {
				var statName = this.curTeam.gen === 1 && i === 'spa' ? 'Spc' : BattleStatNames[i];
				buf += '' + guessed[i] + ' ' + statName + ' / ';
			}
		}
		if (guessedPlus && guessedMinus) buf += ' (+' + BattleStatNames[guessedPlus] + ', -' + BattleStatNames[guessedMinus] + ')';
		else buf = buf.slice(0, -3);
		buf += '</button><small> (<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small></p>';
	}

	// If user clicked the guessed spread button, apply it as JVs (clamp 64/stat, 130 total)
	if (setGuessed) {
		var jvs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		if (this.curTeam.gen === 1) delete jvs.spd;

		// 1) per-stat clamp to 64
		for (var s in jvs) {
			var v = (guessed && guessed[s]) ? guessed[s] : 0;
			v = Math.max(0, Math.min(64, v | 0));
			jvs[s] = v;
		}

		// 2) total clamp to 130 by reducing in a stable order
		var order = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
		if (this.curTeam.gen === 1) order = ['hp', 'atk', 'def', 'spa', 'spe'];

		var total = 0;
		for (var k in jvs) total += jvs[k];

		while (total > 130) {
			var reduced = false;
			for (var oi = 0; oi < order.length && total > 130; oi++) {
				var key = order[oi];
				if (jvs[key] > 0) {
					jvs[key]--;
					total--;
					reduced = true;
				}
			}
			if (!reduced) break;
		}

		set.jvs = jvs;
		this.plus = guessedPlus || '';
		this.minus = guessedMinus || '';
		this.updateNature();
		this.save();
		this.updateStatGraph();
		this.natureChange();
		return;
	}

	// ---- Build the form UI ----
	var stats = { hp: '', atk: '', def: '', spa: '', spd: '', spe: '' };
	if (this.curTeam.gen === 1) delete stats.spd;

	var nature = BattleNatures[set.nature || 'Serious'];
	if (!nature) nature = {};

	var defaultJV = 0;
	var maxJV = 64;
	var stepJV = 1;

	// label column
	buf += '<div class="col labelcol"><div></div>';
	buf += '<div><label>HP</label></div><div><label>Attack</label></div><div><label>Defense</label></div><div>';
	if (this.curTeam.gen === 1) buf += '<label>Special</label></div>';
	else buf += '<label>Sp. Atk.</label></div><div><label>Sp. Def.</label></div>';
	buf += '<div><label>Speed</label></div></div>';

	// base stats column
	buf += '<div class="col basestatscol"><div><em>Base</em></div>';
	for (var i in stats) buf += '<div><b>' + baseStats[i] + '</b></div>';
	buf += '</div>';

	// graph column
	buf += '<div class="col graphcol"><div></div>';
	for (var i in stats) {
		stats[i] = this.getStat(i);
		var width = stats[i] * 180 / 504;
		var color = Math.floor(stats[i] * (i === 'hp' ? 343 : 475) / 714);
		if (color > 360) color = 360;
		if (color <= 25) color = Math.floor(color * 0.5);
		else if (color >= 300) color = Math.floor(color * 1);
		else {
			var m = 0.5 + (color - 25) * (1 - 0.5) / (300 - 25);
			color = Math.floor(color * m);
		}
		buf += '<div><em><span style="width:' + Math.floor(width) + 'px;background:' +
			((i === 'hp' ? stats[i] >= 700 : stats[i] >= 500) ? "#fff" : ('hsl(' + color + ',85%,45%)')) +
			';' + ((i === 'hp' ? color >= 340 : color >= 332) ? 'border:1px solid #000;' : ('border-color:' + ('hsl(' + color + ',85%,35%)'))) +
			'"></span></em></div>';
	}
	buf += '<div><em>Remaining:</em></div>';
	buf += '</div>';

	// JV input column
	buf += '<div class="col evcol"><div><strong>JVs</strong></div>';
	var totaljv = 0;
	this.plus = '';
	this.minus = '';

	for (var i in stats) {
		var v = (set.jvs[i] === undefined ? defaultJV : set.jvs[i]) || 0;
		var text = '' + (v ? v : '');

		if (nature.plus === i) { text += '+'; this.plus = i; }
		if (nature.minus === i) { text += '-'; this.minus = i; }

		buf += '<div><input type="text" name="stat-' + i + '" value="' + BattleLog.escapeHTML(text) + '" class="textbox inputform numform" /></div>';
		totaljv += (v || 0);
	}

	// Remaining (130 total)
	var maxTotalJV = 130;
	if (totaljv <= maxTotalJV) buf += '<div class="totalev"><em>' + (maxTotalJV - totaljv) + '</em></div>';
	else buf += '<div class="totalev"><b>' + (maxTotalJV - totaljv) + '</b></div>';

	buf += '</div>';

	// Slider column (still named evslider-* for compatibility)
	buf += '<div class="col evslidercol"><div></div>';
	for (var i in stats) {
		if (i === 'spd' && this.curTeam.gen === 1) continue;
		var sv = (set.jvs[i] === undefined ? defaultJV : set.jvs[i]) || 0;
		buf += '<div><input type="range" name="evslider-' + i + '" value="' + BattleLog.escapeHTML('' + sv) +
			'" min="0" max="' + maxJV + '" step="' + stepJV + '" class="evslider" tabindex="-1" aria-hidden="true" /></div>';
	}
	buf += '</div>';

	// Stats column (final stats)
	buf += '<div class="col statscol"><div></div>';
	for (var i in stats) buf += '<div><b>' + stats[i] + '</b></div>';
	buf += '</div>';

	// Nature UI (kept)
	if (this.curTeam.gen > 2) {
		buf += '<p style="clear:both">Nature: <select name="nature" class="button">';
		for (var n in BattleNatures) {
			var curNature = BattleNatures[n];
			buf += '<option value="' + n + '"' + (curNature === nature ? 'selected="selected"' : '') + '>' + n;
			if (curNature.plus) buf += ' (+' + BattleStatNames[curNature.plus] + ', -' + BattleStatNames[curNature.minus] + ')';
			buf += '</option>';
		}
		buf += '</select></p>';
		buf += '<p><small><em>Protip:</em> You can also set natures by typing <kbd>+</kbd> and <kbd>-</kbd> next to a stat.</small></p>';
	}

	buf += '</div>';

	this.$chart.html(buf);

	// EV optimizer is not valid under JVs (disable it here)
	this.$chart.find('#statoptimizer').hide();
},

		setStatFormOptimization: function () {
	// JV system: old EV optimizer is not valid. Disable safely.
	if (this.$chart) this.$chart.find('#statoptimizer').hide();
	return;
},
		checkStatOptimizations: function () {
			// updateStatGraph() still calls this; keep it as a harmless no-op.
			if (this.$chart) this.$chart.find('#statoptimizer').hide();
		},

		setSlider: function (stat, val) { this.$chart.find('input[name=evslider-' + stat + ']').val(val || 0); },
		updateNature: function () {
			var set = this.curSet;
			if (!set) return;
			if (this.plus === '' || this.minus === '') { set.nature = 'Serious'; } 
			else { for (var i in BattleNatures) { if (BattleNatures[i].plus === this.plus && BattleNatures[i].minus === this.minus) {
						set.nature = i;
						break;
					}
				}
			}
		},
		statChange: function (e) {
	var inputName = e.currentTarget.name;
	var raw = '' + e.currentTarget.value;

	var set = this.curSet;
	if (!set) return;

	// We only handle JV edits here (stat-*)
	if (inputName.substr(0, 5) !== 'stat-') {
		this.save();
		return;
	}

	if (!set.jvs) set.jvs = {};

	var stat = inputName.substr(5);

	// Detect +/- nature markers (kept from your code)
	var lastchar = raw.charAt(raw.length - 1);
	var firstchar = raw.charAt(0);
	var natureChange = false;

	if ((lastchar === '+' || firstchar === '+') && stat !== 'hp') {
		if (this.plus && this.plus !== stat) this.$chart.find('input[name=stat-' + this.plus + ']').val(set.jvs[this.plus] || '');
		this.plus = stat;
		natureChange = true;
	} else if ((lastchar === '-' || lastchar === "\u2212" || firstchar === '-' || firstchar === "\u2212") && stat !== 'hp') {
		if (this.minus && this.minus !== stat) this.$chart.find('input[name=stat-' + this.minus + ']').val(set.jvs[this.minus] || '');
		this.minus = stat;
		natureChange = true;
	} else if (this.plus === stat) {
		this.plus = '';
		natureChange = true;
	} else if (this.minus === stat) {
		this.minus = '';
		natureChange = true;
	}

	if (natureChange) this.updateNature();

	// Parse number (JV value)
	var val = Math.abs(parseInt(raw, 10));
	if (isNaN(val) || val < 0) val = 0;
	if (val > 64) val = 64;

	// Enforce TOTAL 130 cap by reducing ONLY the edited stat
	var total = 0;
	for (var k in set.jvs) total += (k === stat ? val : (set.jvs[k] || 0));
	if (total > 130) {
		var overflow = total - 130;
		val = val - overflow;
		if (val < 0) val = 0;
	}

	// Only write/update if changed
	if ((set.jvs[stat] || 0) !== val || natureChange) {
		set.jvs[stat] = val;

		// Keep slider + textbox consistent
		this.setSlider(stat, val);
		var disp = '' + (val || '') + (this.plus === stat ? '+' : '') + (this.minus === stat ? '-' : '');
		this.$chart.find('input[name=stat-' + stat + ']').val(disp);

		this.updateStatGraph();
	}

	this.save();
},
	statSlide: function (e) {
	var slider = e.currentTarget;
	var stat = slider.name.substr(9);
	var set = this.curSet;
	if (!set) return;

	if (!set.jvs) set.jvs = {};

	var val = +slider.value;
	var originalVal = val;

	// Enforce per-stat cap (0..64)
	if (val < 0) val = 0;
	if (val > 64) val = 64;

	// Enforce total cap (<=130) by reducing ONLY the edited stat
	if (!this.ignoreEVLimits) {
		var total = 0;
		for (var i in set.jvs) {
			total += (i === stat ? val : (set.jvs[i] || 0));
		}
		if (total > 130) {
			var overflow = total - 130;
			val = val - overflow;
			if (val < 0) val = 0;
		}
	}

	// Keep slider in sync if we adjusted
	if (val !== originalVal) slider.value = val;

	// Write final JV
	set.jvs[stat] = val;

	// Update the textbox (keeps your +/- nature markers)
	var disp = '' + (val || '') + (this.plus === stat ? '+' : '') + (this.minus === stat ? '-' : '');
	this.$('input[name=stat-' + stat + ']').val(disp);

	this.updateStatGraph();
},
statSlided: function (e) {
	this.statSlide(e);
	this.save();
},

		natureChange: function (e) {
			var set = this.curSet;
			if (!set) return;
			if (e) { set.nature = e.currentTarget.value; }
			this.plus = '';
			this.minus = '';
			var nature = BattleNatures[set.nature || 'Serious'];
			for (var i in BattleStatNames) {
				var val = '' + (set.jvs[i] || '');
				if (nature.plus === i) {
					this.plus = i;
					val += '+';
				}
				if (nature.minus === i) {
					this.minus = i;
					val += '-';
				}
				this.$chart.find('input[name=stat-' + i + ']').val(val);
				if (!e) this.setSlider(i, set.jvs[i]);
			}

			this.save();
			this.updateStatGraph();
		},
		genderToggleChange: function (e) {
			console.log('genderToggleChange called!');
			var $btn = $(e.currentTarget);
			var currentGender = $btn.attr('data-value');
			console.log('Current gender:', currentGender);
			// Get set from list item
			var $li = $btn.closest('li');
			var i = +$li.attr('value');
			var set = this.curSetList[i];
			if (!set) {
				console.log('No set found');
				return;
			}
			// Get species to check gender
			var species = this.curTeam.dex.species.get(set.species);
			var speciesGender = species.gender; // 'M', 'F', 'N', or undefined
			console.log('Species gender:', speciesGender);
			// Only toggle if pokemon can be both genders
			if (speciesGender) {
				// Fixed gender (M, F, or N) - don't toggle
				console.log('Fixed gender - not toggling');
				return;
			}
			// Toggle between M and F
			var newGender = currentGender === 'M' ? 'F' : 'M';
			set.gender = newGender;
			console.log('New gender:', newGender);
			// Update button display and styling
			$btn.attr('data-value', newGender);
			if (newGender === 'M') {
				$btn.html('<span style="position: relative; top: -0.75px; right: 2px; color: #0004ffff;">♂</span>').css({
					'background': 'linear-gradient(to right, rgba(0, 150, 255, 0.3) 50%, transparent 50%)',
					'text-align': 'left',
					'padding-left': '6px',
					'padding-right': '0'
				});
			} else {
				$btn.html('<span style="position: relative; top: -1.5px; left: 1px; color: #ff0055ff;">♀</span>').css({
					'background': 'linear-gradient(to left, rgba(255, 100, 150, 0.3) 50%, transparent 50%)',
					'text-align': 'right',
					'padding-right': '6px',
					'padding-left': '0'
				});
			}
			this.save();
		},
		formeToggleSelect: function (e) {
	e.preventDefault();
	e.stopPropagation();

	var set = this.curSet;
	var i = 0;
	if (!set) {
		i = +$(e.currentTarget).closest('li').attr('value');
		set = this.curSetList[i];
	}
	if (!set) return;

	// Open the dedicated forme picker popup
	app.addPopup(FormePopup, { curSet: set, index: i, room: this });
},
		abilitySetChange: function (e) {
  e.preventDefault();
  e.stopPropagation();

  var dex = this.curTeam && this.curTeam.dex;
  if (!dex) return;

  // Which set are we editing?
  // - In set view: this.curSet exists
  // - In team view: use data-setindex on the clicked button
  var set = this.curSet;
  var setIndex = null;

  if (!set) {
    setIndex = parseInt(e.currentTarget.getAttribute('data-setindex') || '', 10);
    if (!isNaN(setIndex) && this.curSetList && this.curSetList[setIndex]) {
      set = this.curSetList[setIndex];
    }
  }
  if (!set) return;

  // Read abilities from modded dex (this is the server-correct source)
  var species = dex.species.get(set.species);
  var abilTable = (species && species.abilities) ? species.abilities : {};

  function cleanAbilityName(x) {
    if (!x) return '';
    if (typeof x !== 'string') return '';
    if (x === 'None') return '';
    return x;
  }

  // IMPORTANT: H/S must be uppercase
  var set1 = [cleanAbilityName(abilTable['0']), cleanAbilityName(abilTable['1'])].filter(Boolean);
  var set2 = [cleanAbilityName(abilTable['H']), cleanAbilityName(abilTable['S'])].filter(Boolean);

  var hasSet2 = !!set2.length;

  var cur = (set.abilitySet === 2 || set.abilitySet === '2') ? 2 : 1;
  var next = (cur === 1 && hasSet2) ? 2 : 1;

  var chosen = (next === 2 ? set2 : set1);

  set.abilitySet = next;
  set.ability = chosen[0] || '';
  set.ability2 = chosen[1] || '';

  // helper: update button visuals (gradient + alignment) to match renderSet style
  function applyAbilitySetButtonStyle(btnEl, which) {
    if (!btnEl) return;
    if (which === 2) {
      btnEl.style.background = 'linear-gradient(to left, rgba(0, 100, 255, 0.3) 50%, transparent 50%)';
      btnEl.style.textAlign = 'right';
      btnEl.style.paddingRight = '5.4px';
      btnEl.style.paddingLeft = '';
    } else {
      btnEl.style.background = 'linear-gradient(to right, rgba(0, 100, 255, 0.3) 50%, transparent 50%)';
      btnEl.style.textAlign = 'left';
      btnEl.style.paddingLeft = '5.4px';
      btnEl.style.paddingRight = '';
    }
  }

  // Update THIS clicked button immediately (fixes "number changes but style doesn't")
  e.currentTarget.textContent = '' + next;
  applyAbilitySetButtonStyle(e.currentTarget, next);

  // If we're in set view, also sync the left-panel inputs + ability chart
  if (this.curSet === set) {
    this.$('input[name=ability]').val(set.ability);
    this.$('input[name=ability2]').val(set.ability2);

    // There may be multiple abilitySetToggle buttons in the set view area;
    // keep them consistent
    var btns = this.$('button[name=abilitySetToggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = '' + next;
      applyAbilitySetButtonStyle(btns[i], next);
    }

    this.updateAbilitySetsForm();
  } else {
    // Team view: rerender the team list so the shown abilities update too
    this.updateTeamView();
  }

  this.curTeam.iconCache = '!';
  this.save();
},
		//#region Set Detail Form
		updateDetailsForm: function () {
			var buf = '';
			var set = this.curSet;
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');
			var isHackmons = this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh');
			var species = this.curTeam.dex.species.get(set.species);
			if (!set) return;
			buf += '<div class="resultheader"><h3>Details</h3></div>';
			buf += '<form class="detailsform">';
			buf += '<div class="formrow"><label class="formlabel">Level:</label><div><input type="number" min="1" max="100" step="1" name="level" value="' + (typeof set.level === 'number' ? set.level : 100) + '" class="textbox inputform numform" /></div></div>';
			if (this.curTeam.gen > 1) {
				buf += '<div class="formrow"><label class="formlabel">Gender:</label><div>';
				if (species.gender && !isHackmons) {
					var genderTable = { 'M': "Male", 'F': "Female", 'N': "Genderless" };
					buf += genderTable[species.gender];
				} else {
					buf += '<label class="checkbox inline"><input type="radio" name="gender" value="M"' + (set.gender === 'M' ? ' checked' : '') + ' /> Male</label> ';
					buf += '<label class="checkbox inline"><input type="radio" name="gender" value="F"' + (set.gender === 'F' ? ' checked' : '') + ' /> Female</label> ';
					if (!isHackmons) { buf += '<label class="checkbox inline"><input type="radio" name="gender" value="N"' + (!set.gender ? ' checked' : '') + ' /> Random</label>'; } 
					else { buf += '<label class="checkbox inline"><input type="radio" name="gender" value="N"' + (set.gender === 'N' ? ' checked' : '') + ' /> Genderless</label>'; }
				}
				buf += '</div></div>';
				if (isLetsGo) { buf += '<div class="formrow"><label class="formlabel">Happiness:</label><div><input type="number" name="happiness" value="70" class="textbox inputform numform" /></div></div>'; } 
				else { if (this.curTeam.gen < 8 || isNatDex) buf += '<div class="formrow"><label class="formlabel">Happiness:</label><div><input type="number" min="0" max="255" step="1" name="happiness" value="' + (typeof set.happiness === 'number' ? set.happiness : 255) + '" class="textbox inputform numform" /></div></div>'; }
				buf += '<div class="formrow"><label class="formlabel">Shiny:</label><div>';
				buf += '<label class="checkbox inline"><input type="radio" name="shiny" value="yes"' + (set.shiny ? ' checked' : '') + ' /> Yes</label> ';
				buf += '<label class="checkbox inline"><input type="radio" name="shiny" value="no"' + (!set.shiny ? ' checked' : '') + ' /> No</label>';
				buf += '</div></div>';
				if (this.curTeam.gen === 8 && !isBDSP) {
					if (!species.cannotDynamax) { buf += '<div class="formrow"><label class="formlabel">Dmax Level:</label><div><input type="number" min="0" max="10" step="1" name="dynamaxlevel" value="' + (typeof set.dynamaxLevel === 'number' ? set.dynamaxLevel : 10) + '" class="textbox inputform numform" /></div></div>'; }
					if (species.canGigantamax || species.forme === 'Gmax') {
						buf += '<div class="formrow"><label class="formlabel">Gigantamax:</label><div>';
						if (species.forme === 'Gmax') { buf += 'Yes'; } 
						else {
							buf += '<label class="checkbox inline"><input type="radio" name="gigantamax" value="yes"' + (set.gigantamax ? ' checked' : '') + ' /> Yes</label> ';
							buf += '<label class="checkbox inline"><input type="radio" name="gigantamax" value="no"' + (!set.gigantamax ? ' checked' : '') + ' /> No</label>';
						}
						buf += '</div></div>';
					}
				}
			}
			if (this.curTeam.gen > 2) {
				buf += '<div class="formrow" style="display:none"><label class="formlabel">Pokeball:</label><div><select name="pokeball" class="button">';
				buf += '<option value=""' + (!set.pokeball ? ' selected="selected"' : '') + '></option>'; // unset
				var balls = this.curTeam.dex.getPokeballs();
				for (var i = 0; i < balls.length; i++) { buf += '<option value="' + balls[i] + '"' + (set.pokeball === balls[i] ? ' selected="selected"' : '') + '>' + balls[i] + '</option>'; }
				buf += '</select></div></div>';
			}
			if (!isLetsGo && (this.curTeam.gen === 7 || isNatDex || (isBDSP && species.baseSpecies === 'Unown'))) {
				buf += '<div class="formrow"><label class="formlabel" title="Hidden Power Type">Hidden Power:</label><div><select name="hptype" class="button">';
				buf += '<option value=""' + (!set.hpType ? ' selected="selected"' : '') + '>(automatic type)</option>'; // unset
				var types = Dex.types.all();
				for (var i = 0; i < types.length; i++) { if (types[i].HPivs) { buf += '<option value="' + types[i].name + '"' + (set.hpType === types[i].name ? ' selected="selected"' : '') + '>' + types[i].name + '</option>'; } }
				buf += '</select></div></div>';
			}
			if (this.curTeam.gen === 9) {
				buf += '<div class="formrow"><label class="formlabel" title="Tera Type">Tera Type:</label><div>';
				buf += '<select name="teratype" class="button">';
				var types = Dex.types.all();
				var teraType = set.teraType || species.requiredTeraType || species.types[0];
				for (var i = 0; i < types.length; i++) { buf += '<option value="' + types[i].name + '"' + (teraType === types[i].name ? ' selected="selected"' : '') + '>' + types[i].name + '</option>'; }
				buf += '</select></div></div>';
			}
			buf += '</form>';
			if (species.cosmeticFormes) { buf += '<button class="altform button">Change sprite</button>'; }
			this.$chart.html(buf);
		},
		detailsChange: function (e) {
			console.log('detailsChange called, target:', e.currentTarget.name, 'value:', e.currentTarget.value);
			e.preventDefault();
			e.stopPropagation();
			var set = this.curSet;
			var i = 0;
			var fieldName = e.currentTarget.name;
			if (!set) {
				i = +$(e.currentTarget).closest('li').attr('value');
				set = this.curSetList[i];
				console.log('Getting set from list, index:', i, 'set:', set);
				// Don't set curSet or update when editing level/happiness from team view. This prevents focusing the Pokemon field
			}
			if (!set) {
				console.log('No set found in detailsChange');
				return;
			}
			var species = this.curTeam.dex.species.get(set.species);
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');
			// level
			var $container = $(e.currentTarget).closest('li');
			console.log('Container found:', $container.length, 'Level input found:', $container.find('input[name=level]').length);
			var level = parseInt($container.find('input[name=level]').val(), 10);
			console.log('Level value:', level, 'from input:', $container.find('input[name=level]').val());
			if (!level || level > 100 || level < 1) level = 100;
			if (level !== 100 || set.level) set.level = level;
			// happiness
			var happiness = parseInt($container.find('input[name=happiness]').val(), 10);
			if (isNaN(happiness) || happiness > 255 || happiness < 0) happiness = 255;
			set.happiness = happiness;
			if (set.happiness === 255) delete set.happiness;
			// shiny
			var shiny = $container.find('input[name=shiny]').is(':checked') || ($container.find('input[name=shiny]:checked').val() === 'yes');
			if (shiny) { set.shiny = true; } 
			else { delete set.shiny; }
			// dynamax level
			var dynamaxLevel = parseInt($container.find('input[name=dynamaxlevel]').val(), 10);
			if (isNaN(dynamaxLevel) || dynamaxLevel > 10 || dynamaxLevel < 0) dynamaxLevel = 10;
			set.dynamaxLevel = dynamaxLevel;
			if (set.dynamaxLevel === 10) delete set.dynamaxLevel;
			// gigantamax
			var gmax = ($container.find('input[name=gigantamax]:checked').val() === 'yes');
			if (gmax) { set.gigantamax = true; } 
			else { delete set.gigantamax; }
			// gender
			var gender = $container.find('select[name=gender]').val() || $container.find('input[name=gender]:checked').val();
			if (gender === 'M' || gender === 'F') { set.gender = gender; } 
			else { delete set.gender; }
			// pokeball
			var pokeball = $container.find('select[name=pokeball]').val();
			if (pokeball && this.curTeam.dex.items.get(pokeball).isPokeball) { set.pokeball = pokeball; } 
			else { delete set.pokeball; }
			// HP type
			var hpType = $container.find('select[name=hptype]').val();
			if (Dex.types.isName(hpType)) { set.hpType = hpType; } 
			else { delete set.hpType; }
			// Tera type
			var teraType = $container.find('select[name=teratype]').val();
			if (Dex.types.isName(teraType) && teraType !== species.types[0]) { set.teraType = teraType; } 
			else { delete set.teraType; }
			// Size
			var size = $container.find('select[name=size]').val();
			if (size && ['XS', 'S', 'M', 'L', 'XL'].includes(size)) { 
				if (size !== 'M') set.size = size; 
				else delete set.size;
			} else { delete set.size; }
			// Update weight display when size changes
			if (fieldName === 'size') {
				var baseWeight = species.weightkg || 0;
				var sizeWeightModifier = species.sizeWeightModifier !== undefined ? species.sizeWeightModifier : 0.1;
				var sizeTiers = 0;
				var selectedSize = size || 'M';
				if (selectedSize === 'XS') sizeTiers = -2;
				else if (selectedSize === 'S') sizeTiers = -1;
				else if (selectedSize === 'L') sizeTiers = 1;
				else if (selectedSize === 'XL') sizeTiers = 2;
				var modifiedWeight = baseWeight * (1 + (sizeTiers * sizeWeightModifier));
				$container.find('.weight-display').text(modifiedWeight.toFixed(1) + ' kg');
			}
			// Only set curSet if we're already viewing a specific Pokemon. Don't set it when editing from team view to preserve focus behavior
			if (this.curSet) { this.curSet = set; }
			this.curSetList[i] = set;
			this.save();
			// Don't call this.update() - it causes re-rendering and focus issues
			// Instead, just update the details display
			// update details cell
			var buf = '';
			var GenderChart = {
				'M': 'Male',
				'F': 'Female',
				'N': '&mdash;'
			};
			buf += '<span class="detailcell detailcell-first"><label>Level</label>' + (set.level || 100) + '</span>';
			if (this.curTeam.gen > 1) {
				buf += '<span class="detailcell"><label>Gender</label>' + GenderChart[set.gender || 'N'] + '</span>';
				if (isLetsGo) { buf += '<span class="detailcell"><label>Happiness</label>70</span>'; }
				else { if (this.curTeam.gen < 8 || isNatDex) buf += '<span class="detailcell"><label>Happiness</label>' + (typeof set.happiness === 'number' ? set.happiness : 255) + '</span>'; }
				buf += '<span class="detailcell"><label>Shiny</label>' + (set.shiny ? 'Yes' : 'No') + '</span>';
				if (!isLetsGo && (this.curTeam.gen < 8 || isNatDex)) buf += '<span class="detailcell"><label>HP Type</label>' + (set.hpType || 'Dark') + '</span>';
				if (this.curTeam.gen === 8 && !isBDSP) {
					if (!species.cannotDynamax) { buf += '<span class="detailcell"><label>Dmax Level</label>' + (typeof set.dynamaxLevel === 'number' ? set.dynamaxLevel : 10) + '</span>'; }
					if (species.canGigantamax || species.forme === 'Gmax') { buf += '<span class="detailcell"><label>Gmax</label>' + (set.gigantamax || species.forme === 'Gmax' ? 'Yes' : 'No') + '</span>'; }
				}
				if (this.curTeam.gen === 9) { buf += '<span class="detailcell"><label>Tera Type</label>' + (set.teraType || species.requiredTeraType || species.types[0]) + '</span>'; }
			}
			this.$('button[name=details]').html(buf);
			this.save();
			// Update only the specific pokemon's sprite
			var $li = $container;
			var $setchart = $li.find('.setchart');
			$setchart.attr('style', this.getScaledTeambuilderSpriteStyle(set));

		},
		altForm: function (e) {
  e.preventDefault();
  e.stopPropagation();

  var set, i;

  if (this.curSet) {
    // focused (set) view
    set = this.curSet;
    i = this.curSetLoc;
  } else {
    // team list view
    i = +$(e.currentTarget).closest('li').attr('value');
    set = this.curSetList[i];
  }

  if (!set) return;

  app.addPopup(FormePopup, {curSet: set, index: i, room: this});
},
		formeToggleSelect: function (e) {
  e.preventDefault();
  e.stopPropagation();

  var set, i;

  if (this.curSet) {
    set = this.curSet;
    i = this.curSetLoc;
  } else {
    i = +$(e.currentTarget).closest('li').attr('value');
    set = this.curSetList[i];
  }

  if (!set) return;

  app.addPopup(FormePopup, {curSet: set, index: i, room: this});
},
		teraTypeSelect: function (e) {
  var set, i;

  if (this.curSet) {
    set = this.curSet;
    i = this.curSetLoc;
  } else {
    i = +$(e.currentTarget).closest('li').attr('value');
    set = this.curSetList[i];
  }

  if (!set) return;
  app.addPopup(TeraTypePopup, {curSet: set, index: i, room: this});
},
		affinityFlagClick: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var flagId = $(e.currentTarget).data('flag');
			if (!flagId) return;
			this.filterMovesByFlag(flagId);
		},
		aversionFlagClick: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var flagId = $(e.currentTarget).data('flag');
			if (!flagId) return;
			this.filterMovesByFlag(flagId);
		},
		filterMovesByFlag: function (flagId) {
			// Find the first empty move slot, or use move1 if all are filled
			var $moveInput = null;
			for (var i = 1; i <= 4; i++) {
				var $input = this.$('input[name=move' + i + ']');
				if (!$input.val() || $input.val().trim() === '') {
					$moveInput = $input;
					break;
				}
			}
			// If all slots are filled, use move1
			if (!$moveInput) { $moveInput = this.$('input[name=move1]'); }
			// Focus the move input
			$moveInput.focus();
			// Wait for the chart to update, then add the filter
			var self = this;
			setTimeout(function () {
				// Remove any existing flag filters first
				if (self.search.engine.filters) {
					var newFilters = [];
					for (var i = 0; i < self.search.engine.filters.length; i++) { if (self.search.engine.filters[i][0] !== 'flag') { newFilters.push(self.search.engine.filters[i]); } }
					self.search.engine.filters = newFilters;
					self.search.filters = newFilters;
				}
				// Add the new flag filter
				self.search.engine.addFilter(['flag', flagId]);
				self.search.filters = self.search.engine.filters;
				self.search.find('');
			}, 50);
		},
		/*********************************************************
		 * Set charts
		 *********************************************************/
		chartTypes: {
			pokemon: 'pokemon',
			item: 'item',
			ability: 'ability',
			ability2: 'ability',
			move1: 'move',
			move2: 'move',
			move3: 'move',
			move4: 'move',
			stats: 'stats',
			details: 'details',
			teraType: 'type'
		},
		chartClick: function (e) {
			console.log('[CHART CLICK] Starting, target:', e.currentTarget);
			if (this.search.addFilter(e.currentTarget)) {
				var curChart = this.$('input[name=' + this.curChartName + ']');
				// if we were searching for the filter, remove it
				if (this.search.q) curChart.val('');
				curChart.select();
				this.search.find('');
				return;
			}
			var entry = $(e.currentTarget).data('entry');
			var val = entry.slice(entry.indexOf("|") + 1);
			console.log('[CHART CLICK] Entry:', entry, 'Val:', val);
			// Check if this is an ability with a specific slot
			var slot = $(e.currentTarget).data('slot');
			console.log('[CHART CLICK] Slot:', slot);
			// Ability clicks in ISL choose the entire ability set (updates BOTH slots).
if (entry && entry.slice(0, 8) === 'ability|') {
  var abilitySetClicked = $(e.currentTarget).data('abilityset');
  var format = (this.curTeam && this.curTeam.format) || '';
  var isISL = (format.includes('indigostarstorm') || format.toLowerCase().includes('isl'));

  if (isISL && abilitySetClicked) {
    var setNum = Number(abilitySetClicked) || 1;

    var dex = this.curTeam.dex;
    var species = dex.species.get(this.curSet.species);
    var abilTable = (species && species.abilities) || {};

    function cleanAbilityName(x) {
      if (!x) return '';
      if (typeof x !== 'string') return '';
      if (x === 'None') return '';
      return x;
    }

    var set1 = [cleanAbilityName(abilTable['0']), cleanAbilityName(abilTable['1'])].filter(Boolean);
    var set2 = [cleanAbilityName(abilTable['H']), cleanAbilityName(abilTable['S'])].filter(Boolean);

    // If set 2 doesn't exist, force set 1
    if (!set2.length) setNum = 1;

    var chosen = (setNum === 2 ? set2 : set1);

    // Update BOTH ability slots together
    this.curSet.abilitySet = setNum;
    this.curSet.ability = chosen[0] || '';
    this.curSet.ability2 = chosen[1] || '';

    // Sync inputs
    this.$('input[name=ability]').val(this.curSet.ability);
    this.$('input[name=ability2]').val(this.curSet.ability2);
    this.$('button[name=abilitySetToggle]').text('' + setNum);

    this.curTeam.iconCache = '!';
    this.updateAbilitySetsForm();
    this.save();
    return;
  }
}
			if (this.curChartType === 'move' && e.currentTarget.className === 'cur') {
				// clicked a move, remove it if we already have it
				var moves = [];
				for (var i = 0; i < this.curSet.moves.length; i++) {
					var curVal = this.curSet.moves[i];
					if (curVal === val) {
						this.unChooseMove(curVal);
						delete this.search.cur[toID(val)];
					} else if (curVal) { moves.push(curVal); }
				}
				if (moves.length < this.curSet.moves.length) {
					this.$('input[name=move1]').val(moves[0] || '');
					this.$('input[name=move2]').val(moves[1] || '');
					this.$('input[name=move3]').val(moves[2] || '');
					this.$('input[name=move4]').val(moves[3] || '');
					this.$('input[name=move' + Math.min(moves.length + 1, 4) + ']').focus();
					this.curSet.moves = moves;
					this.search.find('');
					return;
				}
			}
			this.chartSet(val, true);
		},
		chartKeydown: function (e) {
			var modifier = (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.cmdKey);
			if (e.keyCode === 13 || (e.keyCode === 9 && !modifier)) { // enter/tab
				if (!(this.curChartType in this.searchChartTypes)) return;
				this.updateChart();
				var $firstResult = this.$chart.find('a.hover');
				e.stopPropagation();
				e.preventDefault();
				if (!$firstResult.length) { this.chartChange(e, true);
					return;
				}

				if (this.search.addFilter($firstResult[0])) {
					$(e.currentTarget).val('').select();
					this.search.find('');
					return;
				}
				var entry = $firstResult.data('entry');
				var val = entry.slice(entry.indexOf("|") + 1);
				this.chartSet(val, true);
			} else if (e.keyCode === 38) { // up
				e.preventDefault();
				e.stopPropagation();
				var $active = this.$chart.find('a.hover');
				if (!$active.length) return this.$chart.find('a').first().addClass('hover');
				var $li = $active.parent().prev();
				while ($li[0] && $li[0].firstChild.tagName !== 'A') $li = $li.prev();
				if ($li[0] && $li.children()[0]) {
					$active.removeClass('hover');
					$active = $li.children();
					$active.addClass('hover');
				}
			} else if (e.keyCode === 40) { // down
				e.preventDefault();
				e.stopPropagation();
				var $active = this.$chart.find('a.hover');
				if (!$active.length) return this.$chart.find('a').first().addClass('hover');
				var $li = $active.parent().next();
				while ($li[0] && $li[0].firstChild.tagName !== 'A') $li = $li.next();
				if ($li[0] && $li.children()[0]) {
					$active.removeClass('hover');
					$active = $li.children();
					$active.addClass('hover');
				}
			} else if (e.keyCode === 27 || e.keyCode === 8) { if (!e.currentTarget.value && this.search.removeFilter()) { this.search.find(''); } // esc, backspace
			} else if (e.keyCode === 188) {
				var $firstResult = this.$chart.find('a').first();
				if (!this.search.q) return;
				if (this.search.addFilter($firstResult[0])) {
					e.preventDefault();
					e.stopPropagation();
					$(e.currentTarget).val('').select();
					this.search.find('');
				}
			}
		},
		chartKeyup: function () { this.updateChart(); },
		chartFocus: function (e) {
			var $target = $(e.currentTarget);
			var name = e.currentTarget.name;
			// Only allow focus for pokemon, item, ability, and move fields
			if (name !== 'pokemon' && name !== 'item' && name !== 'ability' && name !== 'ability2' && name !== 'move1' && name !== 'move2' && name !== 'move3' && name !== 'move4') {
				return;
			}
			var type = this.chartTypes[name];
			var wasIncomplete = false;
			if ($target.hasClass('incomplete')) {
				wasIncomplete = true;
				$target.removeClass('incomplete');
			}
			// Always update chart to refresh results, even if same field. Remove early return that prevents refresh
			if (!this.curSet) {
				var i = +$target.closest('li').prop('value');
				this.curSet = this.curSetList[i];
				this.curSetLoc = i;
				this.update();
				if (type === 'stats' || type === 'details') { this.$('button[name=' + name + ']').click(); } 
				else { this.$('input[name=' + name + ']').select(); }
				return;
			}
			this.curChartName = name;
			this.curChartType = type;
			this.updateChart(false, wasIncomplete);
		},
		chartChange: function (e, selectNext) {
			var name = e.currentTarget.name;
			if (this.curChartName !== name) return;
			// Clear qName on blur to force refresh when refocusing
			this.search.qName = null;
			var id = toID(e.currentTarget.value);
			if (id in BattleAliases) id = toID(BattleAliases[id]);
			var val = '';
			var format = this.curTeam.format;
			switch (name) {
			case 'pokemon': val = (id in BattlePokedex ? this.curTeam.dex.species.get(e.currentTarget.value).name : '');
				break;
			case 'ability':
				if (id in BattleItems && format && format.endsWith("dualwielding")) { val = BattleItems[id].name; } 
				else if (id in BattleMovedex && format && format.endsWith("trademarked")) { val = BattleMovedex[id].name; } 
				else { val = (id in BattleAbilities ? BattleAbilities[id].name : ''); }
				break;
			case 'item':
				if (id in BattleMovedex && format && format.endsWith("fortemons")) { val = BattleMovedex[id].name; } 
				else if (id in BattleAbilities && format && format.endsWith("multibility")) { val = BattleAbilities[id].name; } 
				else { val = (id in BattleItems ? BattleItems[id].name : ''); }
				break;
			case 'move1': case 'move2': case 'move3': case 'move4':
				if (id in BattlePokedex && format && format.endsWith("pokemoves")) { val = BattlePokedex[id].name; } 
				else { val = (id in BattleMovedex ? BattleMovedex[id].name : ''); }
				break;
			}
			if (!val) { if (name === 'pokemon' || name === 'ability' || id) { $(e.currentTarget).addClass('incomplete');
					return;
				}
			}
			this.chartSet(val, selectNext);
		},
		searchChange: function (e) {
			var DEBOUNCE_THRESHOLD_TEAMS = 500;
			var searchVal = e.currentTarget.value;
			var self = this;
			function updateTeamList() {
				// 91 for right CMD / 93 for left CMD / 17 for CTL
				if (e.keyCode !== 91 && e.keyCode !== 93 && e.keyCode !== 17) { self.curSearchVal = searchVal; }
				self.updateTeamList();
			}
			// If the user has a lot of teams, search is debounced to ensure this isn't called too frequently while typing
			if (Storage.teams.length > DEBOUNCE_THRESHOLD_TEAMS) {
				if (this.searchTimeout) clearTimeout(this.searchTimeout);
				this.searchTimeout = setTimeout(updateTeamList, 400);
			} else updateTeamList();
		},
		chartSetCustom: function (val) {
			val = toID(val);
			
		},
		chartSet: function (val, selectNext) {
			var inputName = this.curChartName;
			var input = this.$('input[name=' + inputName + ']');
			if (this.chartSetCustom(input.val())) return;
			input.val(val).removeClass('incomplete');
			switch (inputName) {
			case 'pokemon': this.setPokemon(val, selectNext);
				break;
			case 'item':
				this.curSet.item = val;
				this.updatePokemonSprite();
				if (selectNext) this.$(this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]').select();
				break;
			case 'ability':
				this.curSet.ability = val;
				this.curTeam.iconCache = '!';
				if (selectNext) this.$('input[name=move1]').select();
				break;
			case 'ability2':
				this.curSet.ability2 = val;
				this.curTeam.iconCache = '!';
				if (selectNext) this.$('input[name=move1]').select();
				break;
			case 'move1':
				this.unChooseMove(this.curSet.moves[0]);
				this.curSet.moves[0] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move2]').select();
				break;
			case 'move2':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				this.unChooseMove(this.curSet.moves[1]);
				this.curSet.moves[1] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move3]').select();
				break;
			case 'move3':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				if (!this.curSet.moves[1]) this.curSet.moves[1] = '';
				this.unChooseMove(this.curSet.moves[2]);
				this.curSet.moves[2] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move4]').select();
				break;
			case 'move4':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				if (!this.curSet.moves[1]) this.curSet.moves[1] = '';
				if (!this.curSet.moves[2]) this.curSet.moves[2] = '';
				this.unChooseMove(this.curSet.moves[3]);
				this.curSet.moves[3] = val;
				this.chooseMove(val);
				if (selectNext) {
					this.stats();
					this.$('button.setstats').focus();
				}
				break;
			}
			this.save();
		},
		unChooseMove: function (moveName) {
			var set = this.curSet;
			if (!moveName || !set || this.curTeam.format === 'gen7hiddentype') return;
			if (moveName.substr(0, 13) === 'Hidden Power ') {
				if (set.ivs) { for (var i in set.ivs) {
						if (set.ivs[i] === 30) set.ivs[i] = 31;
						if (set.ivs[i] <= 3) set.ivs[i] = 0;
					}
				}
			}
			var resetSpeed = false;
			if (moveName === 'Gyro Ball') { resetSpeed = true; }
			this.chooseMove('', resetSpeed);
		},
		canHyperTrain: function (set) {
			if (this.curTeam.gen < 7 || this.curTeam.format === 'gen7hiddentype') return false;
			var format = this.curTeam.format;
			if (!set.level || set.level === 100) return true;
			if (format.substr(0, 3) === 'gen') format = format.substr(4);
			if (format.substr(0, 10) === 'battlespot' || format.substr(0, 3) === 'vgc' || format === 'ultrasinnohclassic') { if (set.level === 50) return true; }
			return false;
		},
		chooseMove: function (moveName, resetSpeed) {
			var set = this.curSet;
			if (!set) return;
			var gen = this.curTeam.gen;
			var minSpe;
			if (resetSpeed) minSpe = false;
			if (moveName.substr(0, 13) === 'Hidden Power ') {
				if (!this.canHyperTrain(set)) {
					var hpType = moveName.substr(13);
					set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
					if (this.curTeam.gen > 2) {
						var HPivs = this.curTeam.dex.types.get(hpType).HPivs;
						for (var i in HPivs) { set.ivs[i] = HPivs[i]; }
					} else {
						var HPdvs = this.curTeam.dex.types.get(hpType).HPdvs;
						for (var i in HPdvs) { set.ivs[i] = HPdvs[i] * 2; }
						var atkDV = Math.floor(set.ivs.atk / 2);
						var defDV = Math.floor(set.ivs.def / 2);
						var speDV = Math.floor(set.ivs.spe / 2);
						var spcDV = Math.floor(set.ivs.spa / 2);
						var expectedHpDV = (atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2);
						set.ivs.hp = expectedHpDV * 2;
						if (set.ivs.hp === 30) set.ivs.hp = 31;
					}
				}
			} else if (moveName === 'Return') { this.curSet.happiness = 255; } 
			else if (moveName === 'Frustration') { this.curSet.happiness = 0; } 
			else if (moveName === 'Gyro Ball') { minSpe = true; }
			// only available through an event with 31 Spe IVs
			if (set.species.startsWith('Terapagos')) minSpe = false;
			if (this.curTeam.format === 'gen7hiddentype') return;
			var minAtk = true;
			// only available through an event with 31 Atk IVs
			if (set.ability === 'Battle Bond' || ['Koraidon', 'Miraidon', 'Gimmighoul-Roaming'].includes(set.species)) minAtk = false;
			var hpModulo = (this.curTeam.gen >= 6 ? 2 : 4);
			var hasHiddenPower = false;
			var moves = set.moves;
			for (var i = 0; i < moves.length; ++i) {
				if (!moves[i]) continue;
				if (moves[i].substr(0, 13) === 'Hidden Power ') hasHiddenPower = true;
				var move = this.curTeam.dex.moves.get(moves[i]);
				if (move.id === 'transform') {
					hasHiddenPower = true; // A Pokemon with Transform can copy another Pokemon that knows Hidden Power
					var hasMoveBesidesTransform = false;
					for (var j = 0; j < moves.length; ++j) { if (j !== i && moves[j]) {
							hasMoveBesidesTransform = true;
							break;
						}
					}
					if (!hasMoveBesidesTransform) minAtk = false;
				} else if (move.category === 'Physical' && !move.damage && !move.ohko && !['foulplay', 'endeavor', 'counter', 'bodypress', 'seismictoss', 'bide', 'metalburst', 'superfang'].includes(move.id) && !(this.curTeam.gen < 8 && move.id === 'rapidspin')) { minAtk = false; } 
				else if (['metronome', 'assist', 'copycat', 'mefirst', 'photongeyser', 'shellsidearm', 'terablast'].includes(move.id) || (this.curTeam.gen === 5 && move.id === 'naturepower')) { minAtk = false; }
				if (minSpe === false && moveName === 'Gyro Ball') { minSpe = undefined; }
			}
			if (!set.ivs) {
				if (minSpe === undefined && (!minAtk || gen < 3)) return;
				set.ivs = {};
			}
			if (!set.ivs['spe'] && set.ivs['spe'] !== 0) set.ivs['spe'] = 31;
			if (minSpe) { set.ivs['spe'] = (hasHiddenPower ? set.ivs['spe'] % hpModulo : 0); } // min Spe
			else if (minSpe === false) { set.ivs['spe'] = (hasHiddenPower ? 30 + (set.ivs['spe'] % 2) : 31); } // max Spe
			if (gen < 3) return;
			if (!set.ivs['atk'] && set.ivs['atk'] !== 0) set.ivs['atk'] = 31;
			if (minAtk) { 
				if (['Gouging Fire', 'Iron Boulder', 'Iron Crown', 'Raging Bolt'].includes(set.species)) { set.ivs['atk'] = 20; }
				else if (set.species.startsWith('Terapagos')) { set.ivs['atk'] = 15; } 
				else { set.ivs['atk'] = (hasHiddenPower ? set.ivs['atk'] % hpModulo : 0); }
			} else { set.ivs['atk'] = (hasHiddenPower ? 30 + (set.ivs['atk'] % 2) : 31); } // max Atk
		},
		setPokemon: function (val, selectNext) {
			var set = this.curSet;
			var species = this.curTeam.dex.species.get(val);
			if (!species.exists || set.species === species.name) { if (selectNext) this.$('input[name=item]').select();
				return;
			}
			set.name = "";
			set.species = val;
			if (set.level) delete set.level;
			if (this.curTeam && this.curTeam.format) {
				var baseFormat = this.curTeam.format;
				var format = window.BattleFormats && window.BattleFormats[baseFormat];
				if (baseFormat.substr(0, 3) === 'gen') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 4) === 'bdsp') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 8) === 'pokebank') baseFormat = baseFormat.substr(8);
				if (baseFormat.substr(0, 6) === 'natdex') baseFormat = baseFormat.substr(6);
				if (baseFormat.substr(0, 11) === 'nationaldex') baseFormat = baseFormat.substr(11);
				if (baseFormat.substr(-5) === 'draft') baseFormat = baseFormat.substr(0, baseFormat.length - 5);
				if (!baseFormat) baseFormat = 'ou';
				if (this.curTeam && this.curTeam.format) {
					if (baseFormat.substr(0, 10) === 'battlespot' && baseFormat.substr(0, 19) !== 'battlespotspecial13' || baseFormat.substr(0, 3) === 'vgc' || baseFormat.substr(0, 14) === 'battlefestival') set.level = 50;
					if (baseFormat.startsWith('lc') || baseFormat.endsWith('lc')) set.level = 5;
					if (baseFormat.substr(0, 19) === 'battlespotspecial17') set.level = 1;
					if (format && format.teambuilderLevel) { set.level = format.teambuilderLevel; }
				}
			}
			if (set.gender) delete set.gender;
			if (species.gender && species.gender !== 'N') set.gender = species.gender;
			if (set.happiness) delete set.happiness;
			if (set.shiny) delete set.shiny;
			if (set.dynamaxLevel) delete set.dynamaxLevel;
			if (set.gigantamax) delete set.gigantamax;
			if (set.teraType) delete set.teraType;
			if (!(this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh')) && species.requiredItems.length === 1) { set.item = species.requiredItems[0]; } 
			else { set.item = ''; }
			set.abilitySet = 1;
			set.ability = species.abilities['0'];
			set.ability2 = species.abilities['1'] || '';
			set.moves = [];
			set.jvs = {};
			set.ivs = {};
			set.nature = '';
			this.updateSetTop();
			if (selectNext) this.$(set.item || !this.$('input[name=item]').length ? (this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]') : 'input[name=item]').select();
		},
		/*********************************************************
		 * Utility functions
		 *********************************************************/
		//region Stat calculator
		getStat: function (stat, set, jvOverride, natureOverride) {
	if (!set) set = this.curSet;
	if (!set) return 0;

	// JVs are the only per-stat investment now
	if (!set.jvs) set.jvs = {};

	var species = this.curTeam.dex.species.get(set.species);
	if (!species.exists) return 0;

	if (!set.level) set.level = 100;

	var baseStat = species.baseStats[stat];

	// No IVs in the new system: always treat as max (old system max-IV baseline)
	var iv = 31;
	if (this.curTeam.gen <= 2) iv &= 30;

	// JV value (optionally overridden by slider typing code)
	var jv = set.jvs[stat];
	if (jvOverride !== undefined) jv = jvOverride;
	if (jv === undefined) jv = 0;
	jv = Math.max(0, Math.min(64, jv | 0));

	// HP
	if (stat === 'hp') {
		if (baseStat === 1) return 1;
		var hp = Math.floor(Math.floor(2 * baseStat + iv + 100) * set.level / 100 + 10);
		return hp + jv;
	}

	// Other stats
	var val = Math.floor(Math.floor(2 * baseStat + iv) * set.level / 100 + 5);

	// Natures (kept exactly like old code)
	if (natureOverride) val *= natureOverride;
	else if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === stat) val *= 1.1;
	else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === stat) val *= 0.9;

	val = Math.floor(val);

	// JV is +1 final stat per point (NOT scaled by nature)
	return val + jv;
},

		// initialization
		getGen: function (format) {
			format = '' + format;
			if (!format) return 7;
			if (format.substr(0, 3) !== 'gen') return 6;
			return parseInt(format.substr(3, 1), 10) || 6;
		}
	});
	var MoveSetPopup = exports.MoveSetPopup = Popup.extend({
		initialize: function (data) {
			var buf = '<ul class="popupmenu">';
			this.i = data.i;
			this.team = data.team;
			for (var i = 0; i < data.team.length; i++) {
				var set = data.team[i];
				if (i !== data.i && i !== data.i + 1) { buf += '<li><button name="moveHere" value="' + i + '" class="option"><i class="fa fa-arrow-right"></i> Move here</button></li>'; }
				buf += '<li' + (i === data.i ? ' style="opacity:.3"' : ' style="opacity:.6"') + '><span class="picon" style="display:inline-block;vertical-align:middle;' + Dex.getPokemonIcon(set) + '"></span> ' + BattleLog.escapeHTML(set.name || set.species) + '</li>';
			}
			if (i !== data.i && i !== data.i + 1) { buf += '<li><button name="moveHere" value="' + i + '" class="option"><i class="fa fa-arrow-right"></i> Move here</button></li>'; }
			buf += '</ul>';
			this.$el.html(buf);
		},
		moveHere: function (i) {
			this.close();
			i = +i;
			var movedSet = this.team.splice(this.i, 1)[0];
			if (i > this.i) i--;
			this.team.splice(i, 0, movedSet);
			app.rooms['teambuilder'].save();
			if (app.rooms['teambuilder'].curSet) {
				app.rooms['teambuilder'].curSetLoc = i;
				app.rooms['teambuilder'].update();
				app.rooms['teambuilder'].updateChart();
			} else { app.rooms['teambuilder'].update(); }
		}
	});
	var DeleteFolderPopup = this.DeleteFolderPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.folder = data.folder;
			var buf = '<form><p>Remove "' + data.folder.slice(0, -1) + '"?</p><p><label><input type="checkbox" name="addname" /> Add "' + BattleLog.escapeHTML(this.folder.slice(0, -1)) + '" before team names</label></p>';
			buf += '<p><button type="submit"><strong>Remove (keep teams)</strong></button> <!--button name="removeDelete"><strong>Remove (delete teams)</strong></button--> <button type="button" name="close" class="autofocus">Cancel</button></p></form>';
			this.$el.html(buf);
		},
		submit: function (data) {
			this.room.deleteFolder(this.folder, !!this.$('input[name=addname]')[0].checked);
			this.close();
		}
	});
	var FormePopup = this.FormePopup = Popup.extend({
	type: 'semimodal',
		initialize: function (data) {
	this.room = data.room;
	this.curSet = data.curSet;
	this.chartIndex = data.index;

	var dex = this.room.curTeam.dex;

	// Current species and its base species
	var curSpecies = dex.species.get(this.curSet.species);
	var baseSpecies = dex.species.get(curSpecies.baseSpecies);

	var baseId = toID(baseSpecies.name);

	// Build a full list:
	// - base species
	// - real formes (otherFormes)
	// - cosmetic forms (cosmeticFormes)
	var formeIds = [toID(baseSpecies.name)];
	if (baseSpecies.otherFormes) {
	for (var i = 0; i < baseSpecies.otherFormes.length; i++) {
		var formeName = baseSpecies.otherFormes[i];
		var sp = dex.species.get(formeName);

		if (!sp) continue;

		// 🚫 Skip battle-only formes (Mega/Gmax/etc)
		if (
			sp.isMega ||
			sp.isPrimal ||
			sp.isUltra ||
			sp.forme === 'Mega' ||
			sp.forme === 'Mega-X' ||
			sp.forme === 'Mega-Y' ||
			sp.forme === 'Primal' ||
			sp.forme === 'Ultra' ||
			sp.forme === 'Gmax' ||
			sp.isGigantamax ||
			sp.battleOnly
		) {
			continue;
		}

		formeIds.push(toID(formeName));
	}
}
	if (baseSpecies.cosmeticFormes) {
		for (var j = 0; j < baseSpecies.cosmeticFormes.length; j++) {
			formeIds.push(toID(baseSpecies.cosmeticFormes[j]));
		}
	}

	// Dedupe while preserving order
	var seen = {};
	var allIds = [];
	for (var k = 0; k < formeIds.length; k++) {
		var id = formeIds[k];
		if (seen[id]) continue;
		seen[id] = true;
		allIds.push(id);
	}

	// Label header: "Formes" if real formes exist, else "Forms" (cosmetic-only)
	var cosmeticLookup = Object.create(null);
if (baseSpecies.cosmeticFormes && baseSpecies.cosmeticFormes.length) {
	for (var c = 0; c < baseSpecies.cosmeticFormes.length; c++) {
		cosmeticLookup[toID(baseSpecies.cosmeticFormes[c])] = true;
	}
}

var hasRealFormes = false;
if (baseSpecies.otherFormes && baseSpecies.otherFormes.length) {
	for (var f = 0; f < baseSpecies.otherFormes.length; f++) {
		var formeName = baseSpecies.otherFormes[f];
		var sp = dex.species.get(formeName);
		if (!sp) continue;
		// 🚫 EXCLUDE battle-only formes
		if (
			sp.isMega ||
			sp.isPrimal ||
			sp.isUltra ||
			sp.forme === 'Mega' ||
			sp.forme === 'Mega-X' ||
			sp.forme === 'Mega-Y' ||
			sp.forme === 'Primal' ||
			sp.forme === 'Ultra' ||
			sp.forme === 'Gmax' ||
			sp.isGigantamax ||
			sp.battleOnly
		) { continue; }
		var formeId = toID(formeName);
		var isCosmetic =
			!!cosmeticLookup[formeId] || !!(sp && (sp.isCosmeticForme || sp.isCosmetic));
		if (!isCosmetic) {
			hasRealFormes = true;
			break;
		}
	}
}
var headerLabel = hasRealFormes ? 'Formes' : 'Forms';
	var maxSpriteSize = 96;
	var buf = '';
	buf += '<p>Pick a ' + (hasRealFormes ? 'forme' : 'form') + ' or <button name="close" class="button">Cancel</button></p>';
	buf += '<h2 style="margin: 6px 0 8px;">' + headerLabel + '</h2>';
	buf += '<div class="formlist">';

	for (var n = 0; n < allIds.length; n++) {
		var sid = allIds[n];
		var sp = dex.species.get(sid);

		// Display text: everything after first hyphen, else "Base"
		var dash = sp.name.indexOf('-');
		var displayName = (dash >= 0 ? sp.name.slice(dash + 1) : 'Base');

		// sprite id rules: use PS teambuilder sprite helper
		// IMPORTANT: sprite filenames keep hyphens, but toID() removes them.
		// Build sprite filename as: baseid + '-' + suffix (derived from toID form)
		var spid = toID(sp.name);
		var suffix = (spid.startsWith(baseId) ? spid.slice(baseId.length) : '');
		var spriteId = baseId + (suffix ? '-' + suffix : '');

		var spriteData = Dex.getTeambuilderSpriteData(spriteId, dex);
		var spriteSize = (spriteData.spriteDir === 'sprites/dex' ? 120 : 96);
		maxSpriteSize = Math.max(maxSpriteSize, spriteSize);

		var spriteDim = 'width:' + spriteSize + 'px;height:' + spriteSize + 'px;';
		var resize = (spriteData.h ? 'background-size:' + spriteData.h + 'px;' : '');

		var displayName = (sp.forme ? sp.forme : (sp.name.includes('-') ? sp.name.split('-').slice(1).join('-') : 'Base'));
		var isCur = (toID(curSpecies.name) === toID(sp.name));
		// Each option: sprite + label underneath
		buf += '<div style="float:left; width:' + (spriteSize + 12) + 'px; margin: 3px; text-align:center;">';
		buf += '<button name="setSpecies" value="' + BattleLog.escapeHTML(sp.name) + '" class="option' + (isCur ? ' cur' : '') + '" style="';
		buf += 'background-image:url(' + Dex.resourcePrefix + spriteData.spriteDir + '/' + spriteId + '.png);' + spriteDim + resize + '"></button>';
		buf += '<div style="display:block; width:100%; font-size:11px; line-height:12px; margin-top: 4px; text-align:center;">' +
			BattleLog.escapeHTML(displayName) + '</div>';
		buf += '</div>';
	}

	buf += '<div style="clear:both"></div>';
	buf += '</div>';

	this.$el.html(buf).css({ 'max-width': (4 + maxSpriteSize) * 7 });
},

	setSpecies: function (speciesName) {
	var dex = this.room.curTeam.dex;

	var oldSpecies = dex.species.get(this.curSet.species);
	var oldSpeciesName = oldSpecies.name;

	var newSpecies = dex.species.get(speciesName);
	this.curSet.species = newSpecies.name;

	// If nickname is blank OR was effectively the old species name, update it to match the new species
	if (!this.curSet.name || toID(this.curSet.name) === toID(oldSpeciesName)) {
		this.curSet.name = newSpecies.name;
	}

	this.close();

// ----- Write back to the correct team slot -----
var room = this.room;

// In focused view, the correct slot is curSetLoc.
// In team view, use the index passed into the popup.
var idx = (room.curSet ? room.curSetLoc : this.chartIndex);

// Safety: if idx is invalid, don't write.
if (typeof idx !== 'number' || idx < 0 || idx >= room.curSetList.length) return;

// Ensure the room's set references match
if (room.curSet) room.curSet = this.curSet;
room.curSetList[idx] = this.curSet;

// ----- Re-render UI (this updates ability sets immediately) -----
room.update();

// ----- Persist -----
room.curTeam.team = Storage.packTeam(room.curSetList);
Storage.saveTeam(room.curTeam);
app.user.trigger('saveteams');
}
});
	var AltFormPopup = this.AltFormPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.curSet = data.curSet;
			this.chartIndex = data.index;
			var dex = this.room.curTeam.dex;
			var species = dex.species.get(this.curSet.species);
			var baseid = toID(species.baseSpecies);
			var forms = [baseid].concat((species.cosmeticFormes || []).map(toID));
			var maxSpriteSize = 96;
			var buf = '';
			var baseSpecies = dex.species.get(species.baseSpecies);
var hasFormes = baseSpecies.otherFormes && baseSpecies.otherFormes.length;
var title = hasFormes ? 'Pick a forme' : 'Pick a form';
buf += '<p>' + title + ' or <button name="close" class="button">Cancel</button></p>';
			buf += '<div class="formlist">';
			var formCount = forms.length;
			for (var i = 0; i < formCount; i++) {
				var formid = forms[i].substring(baseid.length);
				var form = (formid ? formid[0].toUpperCase() + formid.slice(1) : '');
				var spriteid = baseid + (form ? '-' + formid : '');
				var data = Dex.getTeambuilderSpriteData(spriteid, dex);
				var spriteSize = data.spriteDir === 'sprites/dex' ? 120 : 96;
				maxSpriteSize = Math.max(maxSpriteSize, spriteSize);
				var spriteDim = 'width: ' + spriteSize + 'px; height: ' + spriteSize + 'px;';
				var resize = (data.h ? 'background-size:' + data.h + 'px;' : '');
				buf += '<button name="setForm" value="' + form + '" style="';
				buf += 'background-image: url(' + Dex.resourcePrefix + data.spriteDir + '/' + spriteid + '.png); ' + spriteDim + resize + '" class="option';
				buf += (form === (species.forme || '') ? ' cur' : '') + '"></button>';
			}
			buf += '<div style="clear:both"></div>';
			buf += '</div>';
			this.$el.html(buf).css({ 'max-width': (4 + maxSpriteSize) * 7 });
		},
		setForm: function (form) {
			var species = Dex.species.get(this.curSet.species);
			if (form && form !== species.form) { this.curSet.species = Dex.species.get(species.baseSpecies + form).name; } 
			else if (!form) { this.curSet.species = species.baseSpecies; }
			this.close();
			if (this.room.curSet) { this.room.updatePokemonSprite(); } 
			else { this.room.update(); }
			this.room.curTeam.team = Storage.packTeam(this.room.curSetList);
			Storage.saveTeam(this.room.curTeam);
		}
	});
	var TeraTypePopup = this.TeraTypePopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.curSet = data.curSet;
			this.chartIndex = data.index;
			var species = this.room.curTeam.dex.species.get(this.curSet.species);
			var currentTeraType = this.curSet.teraType || species.requiredTeraType || species.types[0];
			var types = Dex.types.all();
			var buf = '';
			buf += '<p>Select Tera Type or <button name="close" class="button">Cancel</button></p>';
			buf += '<div style="display: grid; grid-template-columns: repeat(5, 1fr);">';
			for (var i = 0; i < types.length; i++) {
				var type = types[i];
				var isSelected = (currentTeraType === type.name);
				buf += '<button name="selectType" value="' + type.name + '" style="';
				buf += 'border: 2px solid ' + (isSelected ? '#4CAF50' : '#ddd') + '; ';
				buf += 'border-radius: 4px; cursor: pointer; display: flex; flex-direction: column; align-items: center;';
				buf += '" title="' + type.name + '">';
				buf += '<img src="' + Dex.resourcePrefix + 'sprites/types/Tera' + type.name + '.png" alt="' + type.name + '" style="width: 32px; height: 32px; object-fit: contain;" />';
				buf += '<span style="font-size: 10px; text-align: center;">' + type.name + '</span>';
				buf += '</button>';
			}
			buf += '</div>';
			this.$el.html(buf).appendTo('body');
		},
		selectType: function (value) {
			var species = this.room.curTeam.dex.species.get(this.curSet.species);
			if (value === species.types[0]) {
				delete this.curSet.teraType;
			} else { this.curSet.teraType = value; }
			this.close();
			this.room.save();
			// Update the tera type icon without focusing/updating the whole view
			var teraType = this.curSet.teraType || species.requiredTeraType || species.types[0];
			var $teamchart = this.room.$('.teamchart li[value="' + this.chartIndex + '"]');
			$teamchart.find('button.teratype').attr('value', teraType);
			$teamchart.find('button.teratype img').attr('src', Dex.resourcePrefix + 'sprites/types/Tera' + teraType + '.png').attr('alt', teraType);
		}
	});
})(window, jQuery);