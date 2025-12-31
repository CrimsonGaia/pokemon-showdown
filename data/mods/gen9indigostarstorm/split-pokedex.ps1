# Split pokedex.ts into smaller files by generation pairs
$content = Get-Content "pokedex.ts" -Raw
$lines = Get-Content "pokedex.ts"

# Find region markers
$regions = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '//region Gen (\d+)') {
        $regions += @{ Gen = [int]$Matches[1]; Line = $i }
    }
}

# Add end marker
$regions += @{ Gen = 999; Line = $lines.Count }

Write-Host "Found $($regions.Count - 1) generation regions"

# Create splits: [1,2] [3,4] [5,6] [7,8] [9]
$splits = @(
    @{ Name = "gen1-2"; Gens = @(1, 2) },
    @{ Name = "gen3-4"; Gens = @(3, 4) },
    @{ Name = "gen5-6"; Gens = @(5, 6) },
    @{ Name = "gen7-8"; Gens = @(7, 8) },
    @{ Name = "gen9"; Gens = @(9) }
)

$header = $lines[0]  # export const Pokedex: ...

foreach ($split in $splits) {
    Write-Host "Creating pokedex-$($split.Name).ts..."
    
    $output = @($header)
    $inRegion = $false
    $currentGen = 0
    
    for ($i = 1; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Check if we're starting a new region
        if ($line -match '//region Gen (\d+)') {
            $currentGen = [int]$Matches[1]
            if ($split.Gens -contains $currentGen) {
                $inRegion = $true
                $output += $line
            } else {
                $inRegion = $false
            }
        }
        # Check if we're ending a region
        elseif ($line -match '//endregion') {
            if ($inRegion) {
                $output += $line
            }
            $inRegion = $false
        }
        # Add line if we're in a region we want
        elseif ($inRegion) {
            $output += $line
        }
        # Keep the closing brace
        elseif ($line -match '^\s*}\s*;\s*$') {
            $output += $line
        }
    }
    
    # Ensure we have a proper closing
    if ($output[-1] -notmatch '^\s*}\s*;\s*$') {
        $output += "};"
    }
    
    $output | Set-Content "pokedex-$($split.Name).ts"
    Write-Host "  Created with $($output.Count) lines"
}

Write-Host "`nNow update pokedex.ts to merge all files:"
Write-Host "Replace the entire content with imports from the split files"
