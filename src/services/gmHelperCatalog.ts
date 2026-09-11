import { GMCommandItem } from '../types';

export const GM_COMMAND_CATALOG: GMCommandItem[] = [
  {
    id: 'unlimitedJumps',
    name: 'Unlimited Jumps',
    func: 'unlimitedJumps',
    tab: 'hacks',
    description: 'Enables double jump count to 100000 with ClientHelper toggle.',
    colorCode: '#00FFDD'
  },
  {
    id: 'Reach',
    name: 'Reach (999 Blocks)',
    func: 'Reach',
    tab: 'hacks',
    description: 'Extends block reach distance to 999 and entity reach to 7.',
    colorCode: '#00FFDD'
  },
  {
    id: 'BowSpeed',
    name: 'Bow Speed',
    func: 'BowSpeed',
    tab: 'hacks',
    description: 'Sets bow pulling speed multiplier to 1000 and removes FOV zoom.',
    colorCode: '#00FFDD'
  },
  {
    id: 'BanClickCD',
    name: 'AttackCD (NoDelay)',
    func: 'BanClickCD',
    tab: 'hacks',
    description: 'Removes attack cooldown and sets bedWarAttackCD to 0.',
    colorCode: '#00FFDD'
  },
  {
    id: 'quickBreak',
    name: 'Fast Break',
    func: 'quickBreak',
    tab: 'hacks',
    description: 'Sets block hardness of blocks 1..40000 to 0 for instant mining.',
    colorCode: '#00FFDD'
  },
  {
    id: 'FreeCam',
    name: 'Free Camera',
    func: 'FreeCam',
    tab: 'hacks',
    description: 'Unhides Main-HideAndSeek-Operate window for detached view.',
    colorCode: '#00FFDD'
  },
  {
    id: 'Respawn',
    name: 'Respawn (Rebirth)',
    func: 'Respawn',
    tab: 'hacks',
    description: 'Triggers client PacketSender sendRebirth directly.',
    colorCode: '#00FFDD'
  },
  {
    id: 'DevFly',
    name: 'Fly (DevFly)',
    func: 'DevFly',
    tab: 'hacks',
    description: 'Sets player allowFlying and initiates vertical vector motion.',
    colorCode: '#00FFDD'
  },
  {
    id: 'JumpHeight',
    name: 'High Jump',
    func: 'JumpHeight',
    tab: 'hacks',
    description: 'Increases JumpHeight property from 0.4 to 1.0.',
    colorCode: '#00FFDD'
  },
  {
    id: 'SpeedManager',
    name: 'Speed Boost',
    func: 'SpeedManager',
    tab: 'hacks',
    description: 'Applies SpeedAdditionLevel to 300000 on player entity.',
    colorCode: '#00FFDD'
  },
  {
    id: 'NoFall',
    name: 'NoFall Damage',
    func: 'NoFall',
    tab: 'hacks',
    description: 'Configures SprintLimitCheck preference to mitigate fall impacts.',
    colorCode: '#00FFDD'
  },
  {
    id: 'quickblock',
    name: 'Quick Place Block',
    func: 'quickblock',
    tab: 'hacks',
    description: 'Sets QuicklyBuildBlockNum count parameter for fast bridge placement.',
    hasInput: true,
    inputPlaceholder: 'Block count (e.g. 10)',
    inputType: 'number',
    colorCode: '#00FFDD'
  },
  {
    id: 'FlyParachute',
    name: 'Fly Parachute',
    func: 'FlyParachute',
    tab: 'hacks',
    description: 'Activates flying and deploys glider parachute animation.',
    colorCode: '#00FFDD'
  },
  {
    id: 'BW',
    name: 'BedWars Bypass',
    func: 'BW',
    tab: 'hacks',
    description: 'Zeros out RunLimitCheck and SprintLimitCheck anti-cheat checks.',
    colorCode: '#00FFDD'
  },
  {
    id: 'BlinkOP',
    name: 'Blink (Desync)',
    func: 'BlinkOP',
    tab: 'hacks',
    description: 'Toggles SyncClientPositionToServer off to freeze ghost position.',
    colorCode: '#00FFDD'
  },
  {
    id: 'tpKill',
    name: 'Auto TP Killer',
    func: 'tpKill',
    tab: 'hacks',
    description: 'Locks onto nearest enemy player, teleports +2 height and simulates click.',
    colorCode: '#00FFDD'
  },
  {
    id: 'AimBot',
    name: 'AimBot Lock',
    func: 'AimBot',
    tab: 'hacks',
    description: 'Calculates pitch and yaw vector to aim at nearest enemy head position.',
    colorCode: '#00FFDD'
  },
  {
    id: 'Tracer',
    name: 'Tracer Line',
    func: 'Tracer',
    tab: 'hacks',
    description: 'Draws directional guide arrows towards every player in the world.',
    colorCode: '#00FFDD'
  },
  {
    id: 'HitBox',
    name: 'HitBox Expansion',
    func: 'HitBox',
    tab: 'hacks',
    description: 'Expands enemy player entity width, height, and length to 10.',
    colorCode: '#00FFDD'
  },
  {
    id: 'ViewRaket',
    name: 'Raket Button',
    func: 'ViewRaket',
    tab: 'hacks',
    description: 'Opens Main-BuildWar-Block floating button with fly and 150k speed.',
    colorCode: '#00FFDD'
  },
  {
    id: 'AutoClick',
    name: 'Auto Clicker',
    func: 'autoClick',
    tab: 'hacks',
    description: 'Fires screen touch click events at (770, 370) on engine tick.',
    colorCode: '#00FFDD'
  },
  {
    id: 'HideNames',
    name: 'Hide Names',
    func: 'HideNames',
    tab: 'effects',
    description: 'Sets RenderHeadText preference to false to conceal overhead nametags.',
    colorCode: '#00FFDD'
  },
  {
    id: 'ChangeName',
    name: 'Change Nickname',
    func: 'ChangeName',
    tab: 'effects',
    description: 'Modifies client player visible nickname in memory.',
    hasInput: true,
    inputPlaceholder: 'New Display Name',
    inputType: 'string',
    colorCode: '#00FFDD'
  },
  {
    id: 'XRayAll',
    name: 'Hide All Blocks (X-Ray)',
    func: 'XRayAll',
    tab: 'effects',
    description: 'Toggles rendering of all 40000 blocks to reveal players and ores.',
    colorCode: '#00FFDD'
  },
  {
    id: 'MaxFPS',
    name: 'Max FPS (No Lag)',
    func: 'MaxFPS',
    tab: 'effects',
    description: 'Sets client engine max FPS to 99999999 for uncapped refresh.',
    colorCode: '#00FFDD'
  },
  {
    id: 'WWE_Cam',
    name: 'WWE Separate Camera',
    func: 'WWE_Cam',
    tab: 'effects',
    description: 'Enables IsSeparateCamera preference for cinematic third-person view.',
    colorCode: '#00FFDD'
  },
  {
    id: 'runCode',
    name: 'Run Lua Code',
    func: 'runCode',
    tab: 'effects',
    description: 'Executes custom inline Lua chunk via pcall(load(content)).',
    hasInput: true,
    inputPlaceholder: 'print("Executed from GMHelper")',
    inputType: 'string',
    colorCode: '#FFFFFF'
  },
  {
    id: 'Noclip',
    name: 'Noclip (Walk Through Blocks)',
    func: 'Noclip',
    tab: 'buggy',
    description: 'Collapses block bounding boxes to (0,0,0,0,0,0) and sets noClip.',
    colorCode: '#00FFDD'
  },
  {
    id: 'LagServer2',
    name: 'Lag Server (DDOS)',
    func: 'LagServer2',
    tab: 'game_panel',
    description: 'Dispatches high-frequency packets (pid: "pid") across 100k loops.',
    colorCode: '#00FFDD'
  },
  {
    id: 'reEnter',
    name: 'Re-enter Game Session',
    func: 'reEnter',
    tab: 'game_panel',
    description: 'Resets and reconnects current CGame instance to the active room.',
    colorCode: '#00FFDD'
  },
  {
    id: 'closeGame',
    name: 'Close Game Client',
    func: 'closeGame',
    tab: 'game_panel',
    description: 'Gracefully exits Blockman GO client process with normal status.',
    colorCode: '#00FFDD'
  },
  {
    id: 'removePanel',
    name: 'Remove GM Panel',
    func: 'removePanel',
    tab: 'game_panel',
    description: 'Removes GMHelper.lua script file from engine resources directory.',
    colorCode: '#FF0000'
  }
];

export function parseColorCodes(raw: string): { text: string; color: string }[] {
  if (!raw) return [{ text: '', color: '#FFFFFF' }];
  const regex = /\^([0-9A-Fa-f]{6})/g;
  const parts: { text: string; color: string }[] = [];
  let lastIndex = 0;
  let currentColor = '#E2E8F0';

  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: raw.substring(lastIndex, match.index),
        color: currentColor
      });
    }
    currentColor = '#' + match[1].toUpperCase();
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    parts.push({
      text: raw.substring(lastIndex),
      color: currentColor
    });
  }

  return parts.length > 0 ? parts : [{ text: raw, color: currentColor }];
}
