import { AndroidRuntimePath, VirtualSandboxFile } from '../types';

export const ANDROID_PACKAGE = 'com.sandboxol.blockymods';

export const ANDROID_RUNTIME_PATHS: AndroidRuntimePath[] = [
  {
    key: 'BASE',
    title: 'Base Directory',
    path: '/data/user/0/com.sandboxol.blockymods',
    description: 'Android root sandbox storage location for Blockman GO application.',
    category: 'BASE'
  },
  {
    key: 'APP_RESOURCES',
    title: 'App Resources',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources',
    description: 'Primary media assets, configuration stores, and downloaded game bundles.',
    category: 'APP RESOURCES'
  },
  {
    key: 'SCRIPTS',
    title: 'Scripts Directory',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts',
    description: 'Lua runtime root containing high-level game logic and client mods.',
    category: 'SCRIPTS'
  },
  {
    key: 'ENGINE',
    title: 'Engine Scripts',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine',
    description: 'Internal engine client Lua utilities, packet handlers, and UI loaders.',
    category: 'ENGINE'
  },
  {
    key: 'ENGINE_RES',
    title: 'Engine Resources',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res',
    description: 'Precompiled binary resources, image sets, and UI layouts.',
    category: 'ENGINE RESOURCES'
  },
  {
    key: 'LAYOUT',
    title: 'Engine Layouts',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res/layout',
    description: 'Dynamic GUI binary definitions for GM Control Panel and GM Main button.',
    category: 'LAYOUT'
  },
  {
    key: 'FILE_GMMAIN',
    title: 'GMMain.binary',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res/layout/GMMain.binary',
    description: 'Base64 encoded binary layout for GM overlay launcher icon.',
    category: 'FILE',
    isExecutable: false
  },
  {
    key: 'FILE_GMCONTROLPANEL',
    title: 'GMControlPanel.binary',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res/layout/GMControlPanel.binary',
    description: 'Base64 encoded binary layout for GM in-game drawer tabs.',
    category: 'FILE',
    isExecutable: false
  },
  {
    key: 'FILE_GMHELPER',
    title: 'GMHelper.lua',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/lua/engine_client/helper/GMHelper.lua',
    description: 'Source of truth Lua script housing all registered hacks, effects, and hooks.',
    category: 'FILE',
    isExecutable: true
  }
];

export const GMHELPER_LUA_SOURCE = `local GMHelper = {}

function GMHelper.unlimitedJumps()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        local current = player.Player.enableDoubleJumps
        player.Player.enableDoubleJumps = not current
        player.Player.doubleJumpCount = 10000
        if not current then
            UIHelper.showToast("^00FF00FLy ON")
        else
            UIHelper.showToast("^FF0000FLy OFF")
        end
    end
end

function GMHelper.Reach()
    local client = PlayerManager:getClientPlayer()
    local current = ClientHelper.getFloatPrefs("BlockReachDistance", 6.5)
    if current < 100 then
        ClientHelper.putFloatPrefs("BlockReachDistance", 999.0)
        ClientHelper.putFloatPrefs("EntityReachDistance", 7.0)
        UIHelper.showToast("^00FF00REACH ON")
    else
        ClientHelper.putFloatPrefs("BlockReachDistance", 6.5)
        ClientHelper.putFloatPrefs("EntityReachDistance", 5.0)
        UIHelper.showToast("^00FF00REACH OFF")
    end
end

function GMHelper.BowSpeed()
    ClientHelper.putFloatPrefs("BowSpeedMultiplier", 1000.0)
    ClientHelper.putFloatPrefs("BowFovMultiplier", 0.0)
    UIHelper.showToast("^00FF00BowSpeed:ON")
end

function GMHelper.BanClickCD()
    local client = PlayerManager:getClientPlayer()
    if client and client.Player then
        local isNoCd = client.Player.attackCd == 0
        if not isNoCd then
            client.Player.attackCd = 0
            ClientHelper.putBoolPrefs("banClickCD", true)
            UIHelper.showToast("^00FF00NoDelay ON!")
        else
            client.Player.attackCd = 5
            ClientHelper.putBoolPrefs("banClickCD", false)
            UIHelper.showToast("^FF0000NoDelay OFF!")
        end
    end
end

function GMHelper.quickBreak()
    for i = 1, 40000 do
        local block = BlockManager:getBlockById(i)
        if block then
            block:setHardness(0)
        end
    end
    UIHelper.showToast("^00FF00Fast Break ON")
end

function GMHelper.DevFly()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        player.Player:setAllowFlying(true)
        player.Player:setFlying(true)
        local moveDir = VectorUtil.newVector3(0.0, 1.35, 0.0)
        player.Player:moveEntity(moveDir)
        player.Player:setSpeedAdditionLevel(150000)
        UIHelper.showToast("^FF00EESuccess")
    end
end

function GMHelper.JumpHeight()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        local current = player.Player.jumpHeight
        if current < 0.8 then
            player.Player.jumpHeight = 1.0
            UIHelper.showToast("^00FF00[ON]")
        else
            player.Player.jumpHeight = 0.4
            UIHelper.showToast("^00FF00[OFF]")
        end
    end
end

function GMHelper.SpeedManager()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        local current = player.Player.speedAdditionLevel
        if current == 0 then
            player.Player.speedAdditionLevel = 300000
            UIHelper.showToast("^FF00EEON")
        else
            player.Player.speedAdditionLevel = 0
            UIHelper.showToast("^FF00EEOFF")
        end
    end
end

function GMHelper.NoFall()
    local cur = ClientHelper.getIntPrefs("SprintLimitCheck", 0)
    if cur == 0 then
        ClientHelper.putIntPrefs("SprintLimitCheck", 7)
        UIHelper.showToast("^FF00EE[ON]")
    else
        ClientHelper.putIntPrefs("SprintLimitCheck", 0)
        UIHelper.showToast("^FF00EEOFF")
    end
end

function GMHelper.quickblock(amount)
    amount = tonumber(amount) or 64
    ClientHelper.putIntPrefs("QuicklyBuildBlockNum", amount)
    UIHelper.showToast("^FF00EESuccess")
end

function GMHelper.FlyParachute()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        player.Player:setAllowFlying(true)
        player.Player:setFlying(true)
        UIHelper.showToast("^FF00EESuccess")
    end
end

function GMHelper.BW()
    ClientHelper.putIntPrefs("RunLimitCheck", 0)
    ClientHelper.putIntPrefs("SprintLimitCheck", 0)
    UIHelper.showToast("^FF00EESuccess")
end

function GMHelper.BlinkOP()
    local client = PlayerManager:getClientPlayer()
    if client and client.Player then
        local cur = client.Player.syncPositionToServer
        client.Player.syncPositionToServer = not cur
        if cur then
            UIHelper.showToast("^00FF00Blink Enabled!")
        else
            UIHelper.showToast("^FF0000Blink Disabled!")
        end
    end
end

function GMHelper.tpKill()
    local me = PlayerManager:getClientPlayer()
    local targets = PlayerManager:getPlayers()
    for _, t in ipairs(targets) do
        if t ~= me and t.Player then
            me.Player:setPosition(t.Player:getPosition())
            break
        end
    end
    UIHelper.showToast("^00FF00Auto tp kill ON")
end

function GMHelper.AimBot()
    UIHelper.showToast("^FF0000AimBot ON!")
end

function GMHelper.Tracer()
    local me = PlayerManager:getClientPlayer()
    if me and me.Player then
        me.Player:deleteAllGuideArrow()
        for _, pl in pairs(PlayerManager:getPlayers()) do
            if pl ~= me and pl.Player then
                me.Player:addGuideArrow(pl.Player:getPosition())
            end
        end
        UIHelper.showToast("^FF00EE[ON]")
    end
end

function GMHelper.HitBox()
    local client = PlayerManager:getClientPlayer()
    for _, pl in pairs(PlayerManager:getPlayers()) do
        if pl ~= client and pl.Player then
            pl.Player.width = 10.0
            pl.Player.height = 10.0
            pl.Player.lenght = 10.0
        end
    end
    UIHelper.showToast("^FF00EE[ON]")
end

function GMHelper.ViewRaket()
    local ui = UIManager:getWindow("Main-BuildWar-Block")
    if ui then
        ui:setVisible(true)
    end
    UIHelper.showToast("^00FF00Raket Button Initialized")
end

function GMHelper.autoClick()
    LuaTimer:scheduleTimer(function()
        CGame.Instance():handleTouchClick(770, 370)
    end, 25, -1)
    UIHelper.showToast("^FF00EE[ON]")
end

function GMHelper.HideNames()
    local cur = ClientHelper.getBoolPrefs("RenderHeadText", true)
    ClientHelper.putBoolPrefs("RenderHeadText", not cur)
    if cur then
        UIHelper.showToast("^00FF00Hide Names ON")
    else
        UIHelper.showToast("^FF0000Hide names OFF")
    end
end

function GMHelper.ChangeName(newName)
    newName = tostring(newName or "BMGO_Player")
    local client = PlayerManager:getClientPlayer()
    if client and client.Player then
        client.Player:setName(newName)
        UIHelper.showToast("^FF00EENick Name Changed: " .. newName)
    end
end

function GMHelper.XRayAll()
    UIHelper.showToast("^FF00EESuccess")
end

function GMHelper.MaxFPS()
    ClientHelper.putIntPrefs("MaxFPS", 99999999)
    UIHelper.showToast("^FF00EE[ON] Max FPS set to uncapped")
end

function GMHelper.WWE_Cam()
    local cur = ClientHelper.getBoolPrefs("IsSeparateCamera", false)
    ClientHelper.putBoolPrefs("IsSeparateCamera", not cur)
    if not cur then
        UIHelper.showToast("^00FF00SeparateCamera: Enabled")
    else
        UIHelper.showToast("^FF0000SeparateCamera: Disabled")
    end
end

function GMHelper.runCode(code)
    local fn, err = loadstring(code)
    if fn then
        pcall(fn)
        UIHelper.showToast("^00FF00runned successfully")
    else
        UIHelper.showToast("^FF0000error: " .. tostring(err))
    end
end

function GMHelper.Noclip()
    local player = PlayerManager:getClientPlayer()
    if player and player.Player then
        local cur = player.Player.noClip
        player.Player.noClip = not cur
        if not cur then
            UIHelper.showToast("^00FF00Noclip = true")
        else
            UIHelper.showToast("^FF0000Noclip = false")
        end
    end
end

function GMHelper.LagServer2()
    UIHelper.showToast("^FF0000DDosing")
end

function GMHelper.reEnter()
    UIHelper.showToast("^FF0000Resetting...")
    CGame.Instance():resetGame("g1001")
end

function GMHelper.closeGame()
    UIHelper.showToast("^FF0000Bye")
    CGame.Instance():exitGame()
end

function GMHelper.removePanel()
    UIHelper.showToast("deleted")
end

return GMHelper`;

export const INITIAL_SANDBOX_FILES: VirtualSandboxFile[] = [
  {
    id: 'f-gmhelper',
    name: 'GMHelper.lua',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/lua/engine_client/helper/GMHelper.lua',
    type: 'file',
    size: '8.4 KB',
    category: 'Lua Script',
    content: GMHELPER_LUA_SOURCE,
    isExecutable: true,
    lastModified: 'Just now'
  },
  {
    id: 'f-gmmain',
    name: 'GMMain.binary',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res/layout/GMMain.binary',
    type: 'file',
    size: '2.1 KB',
    category: 'GUI Layout',
    content: `<?xml version="1.0" encoding="UTF-8"?>\n<GUILayout version="4">\n  <Window type="DefaultWindow" name="GMMain">\n    <Property name="Position" value="{{0.85,0},{0.2,0}}" />\n    <Property name="Size" value="{{0,56},{0,56}}" />\n    <Property name="AlwaysOnTop" value="True" />\n    <Property name="HoverImage" value="set:GM image:MainHover" />\n    <Property name="NormalImage" value="set:GM image:MainNormal" />\n  </Window>\n</GUILayout>`,
    isExecutable: false,
    lastModified: 'Verified build'
  },
  {
    id: 'f-gmcontrol',
    name: 'GMControlPanel.binary',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/res/layout/GMControlPanel.binary',
    type: 'file',
    size: '14.8 KB',
    category: 'GUI Layout',
    content: `<?xml version="1.0" encoding="UTF-8"?>\n<GUILayout version="4">\n  <Window type="TaharezLook/FrameWindow" name="GMControlPanel">\n    <Property name="Position" value="{{0.1,0},{0.1,0}}" />\n    <Property name="Size" value="{{0.8,0},{0.8,0}}" />\n    <Property name="Text" value="BMGO GM CONTROL PANEL" />\n    <Window type="TaharezLook/TabControl" name="TabList">\n      <Window type="DefaultWindow" name="HacksTab" />\n      <Window type="DefaultWindow" name="EffectsTab" />\n      <Window type="DefaultWindow" name="BuggyTab" />\n      <Window type="DefaultWindow" name="GamePanelTab" />\n    </Window>\n  </Window>\n</GUILayout>`,
    isExecutable: false,
    lastModified: 'Verified build'
  },
  {
    id: 'f-bw-quickblock',
    name: 'bedwars_quickblock.lua',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/bedwars_quickblock.lua',
    type: 'file',
    size: '1.2 KB',
    category: 'Lua Script',
    content: `-- BedWars Fast Quickblock\nClientHelper.putIntPrefs("QuicklyBuildBlockNum", 64)\nClientHelper.putIntPrefs("RunLimitCheck", 0)\nClientHelper.putIntPrefs("SprintLimitCheck", 0)\nUIHelper.showToast("^00FF00BedWars Quickblock Loaded")`,
    isExecutable: true,
    lastModified: 'Today'
  },
  {
    id: 'f-combat-reach',
    name: 'combat_reach_nobow.lua',
    path: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/combat_reach_nobow.lua',
    type: 'file',
    size: '1.6 KB',
    category: 'Lua Script',
    content: `-- Combat Reach & Instant Attack\nClientHelper.putFloatPrefs("BlockReachDistance", 999.0)\nClientHelper.putFloatPrefs("EntityReachDistance", 12.0)\nClientHelper.putBoolPrefs("banClickCD", true)\nClientHelper.putFloatPrefs("BowSpeedMultiplier", 1000.0)\nUIHelper.showToast("^00FF00Combat Suite Active")`,
    isExecutable: true,
    lastModified: 'Today'
  }
];
