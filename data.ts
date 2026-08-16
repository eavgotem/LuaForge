--- src/data.ts (原始)


+++ src/data.ts (修改后)
/* ------------------------------------------------------------------ */
/*  LuauForge site content                                             */
/* ------------------------------------------------------------------ */

export interface Scenario {
  id: string;
  chip: string;
  prompt: string;
  file: string;
  location: string;
  keywords: string[];
  code: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "rounds",
    chip: "Round-based minigame",
    prompt: "Build a round-based minigame loop with intermissions and a winner check",
    file: "RoundManager",
    location: "ServerScriptService",
    keywords: ["round", "minigame", "loop", "intermission", "arena"],
    code: `--!strict
-- RoundManager | lives in ServerScriptService
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local StatusEvent = ReplicatedStorage:WaitForChild("RoundStatus")
local ARENA_SPAWN = workspace:WaitForChild("Arena"):WaitForChild("Spawn")

local INTERMISSION = 15
local ROUND_LENGTH = 90

local function teleportToArena(player: Player)
        local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
        if root then
                root.CFrame = ARENA_SPAWN.CFrame + Vector3.new(0, 4, 0)
        end
end

while true do
        for i = INTERMISSION, 1, -1 do
                StatusEvent:FireAllClients("Intermission ends in " .. i)
                task.wait(1)
        end

        local survivors = {}
        for _, player in Players:GetPlayers() do
                if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
                        table.insert(survivors, player)
                        teleportToArena(player)
                end
        end

        StatusEvent:FireAllClients("Round started — good luck!")
        local elapsed = 0
        while elapsed < ROUND_LENGTH and #survivors > 1 do
                task.wait(1)
                elapsed += 1
                local alive = {}
                for _, p in survivors do
                        if p.Character and p.Character:FindFirstChildOfClass("Humanoid") then
                                table.insert(alive, p)
                        end
                end
                survivors = alive
        end

        if #survivors == 1 then
                StatusEvent:FireAllClients(survivors[1].Name .. " wins the round!")
        else
                StatusEvent:FireAllClients("Round over — no survivors.")
        end
        task.wait(3)
end`,
  },
  {
    id: "datastore",
    chip: "DataStore save & load",
    prompt: "Save and load player coins with DataStoreService, safely",
    file: "CoinSaver",
    location: "ServerScriptService",
    keywords: ["datastore", "save", "load", "coins", "leaderstats", "data"],
    code: `--!strict
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local store = DataStoreService:GetDataStore("PlayerCoins_v1")

local function loadData(player: Player)
        local ok, coins = pcall(function()
                return store:GetAsync("coins_" .. player.UserId)
        end)

        local stats = Instance.new("Folder")
        stats.Name = "leaderstats"
        stats.Parent = player

        local coinsVal = Instance.new("IntValue")
        coinsVal.Name = "Coins"
        coinsVal.Value = if ok and typeof(coins) == "number" then coins else 0
        coinsVal.Parent = stats
end

local function saveData(player: Player)
        local stats = player:FindFirstChild("leaderstats")
        local coins = stats and stats:FindFirstChild("Coins")
        if not coins then return end

        local ok, err = pcall(function()
                store:SetAsync("coins_" .. player.UserId, (coins :: IntValue).Value)
        end)
        if not ok then
                warn("Save failed for " .. player.Name .. ": " .. tostring(err))
        end
end

Players.PlayerAdded:Connect(loadData)
Players.PlayerRemoving:Connect(saveData)

game:BindToClose(function()
        for _, player in Players:GetPlayers() do
                saveData(player)
        end
end)`,
  },
  {
    id: "damagepad",
    chip: "Damage pad on touch",
    prompt: "Make a lava pad that damages players on touch with a cooldown",
    file: "LavaPad",
    location: "Workspace.LavaPads",
    keywords: ["damage", "lava", "touch", "pad", "hurt", "kill"],
    code: `--!strict  (Script inside the pad part)
local pad = script.Parent
local DAMAGE = 25
local COOLDOWN = 0.8

local lastHit: { [Model]: number } = {}

pad.Touched:Connect(function(hit: BasePart)
        local character = hit.Parent
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if not humanoid or humanoid.Health <= 0 then return end

        local now = os.clock()
        local previous = lastHit[character]
        if previous and now - previous < COOLDOWN then return end

        lastHit[character] = now
        humanoid:TakeDamage(DAMAGE)
end)`,
  },
  {
    id: "doublejump",
    chip: "Double jump for everyone",
    prompt: "Give every player a double jump with a LocalScript",
    file: "DoubleJump",
    location: "StarterPlayerScripts",
    keywords: ["jump", "double", "movement", "local"],
    code: `--!strict  (LocalScript in StarterPlayerScripts)
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local EXTRA_JUMPS = 1

local function onCharacterAdded(character: Model)
        local humanoid = character:WaitForChild("Humanoid")
        local jumpsLeft = 0

        humanoid.StateChanged:Connect(function(_, newState)
                if newState == Enum.HumanoidStateType.Landed then
                        jumpsLeft = EXTRA_JUMPS
                end
        end)

        UserInputService.JumpRequest:Connect(function()
                local state = humanoid:GetState()
                if jumpsLeft > 0 and state ~= Enum.HumanoidStateType.Dead then
                        jumpsLeft -= 1
                        humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
                end
        end)
end

player.CharacterAdded:Connect(onCharacterAdded)
if player.Character then
        onCharacterAdded(player.Character)
end`,
  },
  {
    id: "shop",
    chip: "Server-validated shop",
    prompt: "A shop RemoteEvent that sells items for coins with server-side validation",
    file: "ShopServer",
    location: "ServerScriptService",
    keywords: ["shop", "buy", "sell", "purchase", "remote", "store"],
    code: `--!strict
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local buyEvent = ReplicatedStorage:WaitForChild("BuyItem")
local catalog = ReplicatedStorage:WaitForChild("ShopItems")

local PRICES: { [string]: number } = {
        SpeedCoil = 100,
        GravityCoil = 250,
        IronSword = 500,
}

buyEvent.OnServerEvent:Connect(function(player: Player, itemName: unknown)
        -- Never trust the client: validate everything server-side.
        if typeof(itemName) ~= "string" then return end
        local price = PRICES[itemName]
        if not price then return end

        local stats = player:FindFirstChild("leaderstats")
        local coins = stats and stats:FindFirstChild("Coins") :: IntValue?
        if not coins or coins.Value < price then return end

        local item = catalog:FindFirstChild(itemName)
        if not item then return end

        coins.Value -= price
        item:Clone().Parent = player:WaitForChild("Backpack")
end)`,
  },
  {
    id: "daynight",
    chip: "Smooth day/night cycle",
    prompt: "A smooth day and night cycle driven by Heartbeat",
    file: "DayNight",
    location: "ServerScriptService",
    keywords: ["day", "night", "cycle", "lighting", "time", "sun"],
    code: `--!strict
local Lighting = game:GetService("Lighting")
local RunService = game:GetService("RunService")

local FULL_DAY_SECONDS = 720 -- one in-game day = 12 real minutes

RunService.Heartbeat:Connect(function(dt: number)
        local hoursPerSecond = 24 / FULL_DAY_SECONDS
        Lighting.ClockTime = (Lighting.ClockTime + dt * hoursPerSecond) % 24
end)`,
  },
];

export function genericScenario(prompt: string): Scenario {
  const clean = prompt.trim().slice(0, 60) || "my new system";
  return {
    id: "custom",
    chip: "Custom prompt",
    prompt,
    file: "GeneratedSystem",
    location: "ServerScriptService",
    keywords: [],
    code: `--!strict
-- LuauForge draft for: "${clean}"
-- Scaffold generated from your prompt. Extend each hook below.

local RunService = game:GetService("RunService")

export type Config = {
        enabled: boolean,
        tickRate: number,
}

local config: Config = {
        enabled = true,
        tickRate = 1 / 20,
}

local function init()
        print("[GeneratedSystem] online")
end

local function tick(dt: number)
        -- per-frame / per-tick work goes here
end

if config.enabled then
        init()
        RunService.Heartbeat:Connect(tick)
end`,
  };
}

/* ------------------------------------------------------------------ */

export interface Feature {
  icon: string;
  title: string;
  body: string;
  points: string[];
}

export const FEATURES: Feature[] = [
  {
    icon: "datamodel",
    title: "Reads your DataModel, not a blank page",
    body: "LuauForge inspects the Explorer selection, service layout, and the script it lives next to — so generated code references the instances you actually have, by their real names.",
    points: ["Explorer + Properties context window", "Knows your Remotes, Folders and Modules by name", "Adapts to Team Create layouts"],
  },
  {
    icon: "insert",
    title: "Writes straight into the Explorer",
    body: "No copy-paste gymnastics. It creates the Script, ModuleScript or LocalScript in the correct service, parents it, opens it, and stamps a Change History waypoint so Ctrl+Z always works.",
    points: ["Creates instances via the plugin API", "Undo / redo waypoints on every write", "Respects Server vs. Client boundaries"],
  },
  {
    icon: "fix",
    title: "Eats red Output lines for breakfast",
    body: "Paste an error from the Output window and LuauForge diffs a fix against your script — explaining what blew up in plain English before it touches a single line.",
    points: ["Error → cause → patch, in that order", "Handles nil indexing, WaitForChild races, DataStore throttling", "One-click apply with waypoint"],
  },
  {
    icon: "strict",
    title: "Strict-typed Luau by default",
    body: "Every generation ships with --!strict, exported types and annotations that pass the built-in analyzer. Your future self — and your teammates — will thank you.",
    points: ["--!strict on every file", "Typed tables, unions and casts done right", "Matches your codebase's naming style"],
  },
  {
    icon: "idioms",
    title: "Fluent in platform idioms",
    body: "task.wait over wait(0.03). BindToClose saves. Server-side validation on every RemoteEvent. It was raised on a decade of public Roblox code and it shows.",
    points: ["task library, attributes, CollectionService tags", "Secure client-server patterns baked in", "DataStore retry + session-lock patterns"],
  },
  {
    icon: "convert",
    title: "Explains, refactors, converts",
    body: "Drop in a spaghetti 2019 script and get back a typed, commented, module-split refactor — or just ask \"what does line 42 do?\" and get an honest answer.",
    points: ["Legacy Lua → modern Luau", "Splits monoliths into ModuleScripts", "Line-by-line explanations on request"],
  },
  {
    icon: "zero",
    title: "Zero metering. Zero invoices.",
    body: "No token counter, no API key, no credit card. Inference runs on a community GPU pool funded by optional cosmetic Forge Passes. The meter simply doesn't exist.",
    points: ["No API key, no account required", "Offline fallback model for common templates", "Open weights — audit everything"],
  },
];

/* ------------------------------------------------------------------ */

export interface Step {
  num: string;
  title: string;
  body: string;
  snippet: string;
}

export const STEPS: Step[] = [
  {
    num: "01",
    title: "Install the plugin",
    body: "Grab “LuauForge” from the Creator Store — or drop the raw LuauForgePlugin.lua into your Studio plugins folder and restart. Either way you're in within sixty seconds.",
    snippet: `%localappdata%\\Roblox\\Plugins\\\n  └─ LuauForgePlugin.lua   (2.1 KB → 14 KB unpacked)`,
  },
  {
    num: "02",
    title: "Flip one Studio setting",
    body: "Studio talks to the free inference pool over HTTPS. Enable File → Studio Settings → Studio → “Enable HTTP Requests” and you're wired up. Nothing else to configure — no key, no login.",
    snippet: `Studio Settings → Studio\n  [x] Enable HTTP Requests   ← the only switch`,
  },
  {
    num: "03",
    title: "Dock the panel",
    body: "Plugins tab → LuauForge. The widget docks beside Properties like it was always meant to live there. It watches your selection, so context is automatic.",
    snippet: `View · Plugins\n  ┌ Explorer ─┬─ Properties ─┬─ ⚒ LuauForge ─┐`,
  },
  {
    num: "04",
    title: "Prompt, review, ship",
    body: "Type intent like you'd brief a teammate. Review the generated diff, hit Insert, playtest. Every write is undo-able — the History service stamps a waypoint each time.",
    snippet: `> "leaderstats with coins, saved on leave"\n✓ Script inserted → ServerScriptService.CoinSaver`,
  },
];

/* ------------------------------------------------------------------ */

export interface GalleryItem {
  prompt: string;
  tag: string;
  lines: number;
  ms: number;
  code: string;
}

export const GALLERY_TAGS = ["All", "Combat", "Economy", "GUI", "Movement", "Systems", "Data"] as const;

export const GALLERY: GalleryItem[] = [
  {
    prompt: "Kill brick with per-player cooldown",
    tag: "Combat",
    lines: 21,
    ms: 640,
    code: `local lastKill: { [Player]: number } = {}
pad.Touched:Connect(function(hit)
        local player = Players:GetPlayerFromCharacter(hit.Parent)
        if not player then return end
        if os.clock() - (lastKill[player] or 0) < 2 then return end
        lastKill[player] = os.clock()
        hit.Parent:BreakJoints()
end)`,
  },
  {
    prompt: "Sword combo that tracks hit count",
    tag: "Combat",
    lines: 47,
    ms: 910,
    code: `local combo = 0
local lastSwing = 0
tool.Activated:Connect(function()
        if os.clock() - lastSwing > 1.2 then combo = 0 end
        combo += 1
        lastSwing = os.clock()
        swingRemote:FireServer(combo % 3 + 1)
end)`,
  },
  {
    prompt: "Coin shop with server-side validation",
    tag: "Economy",
    lines: 38,
    ms: 830,
    code: `buyEvent.OnServerEvent:Connect(function(player, item)
        if typeof(item) ~= "string" then return end
        local price = PRICES[item]
        if not price or getCoins(player) < price then return end
        spendCoins(player, price)
        giveItem(player, item)
end)`,
  },
  {
    prompt: "Daily reward streak with timezone-safe reset",
    tag: "Economy",
    lines: 52,
    ms: 1020,
    code: `local today = os.date("!*t")
local dayKey = string.format("%04d-%02d-%02d",
        today.year, today.month, today.day)
if profile.lastClaim ~= dayKey then
        local streak = isYesterday(profile.lastClaim)
                and profile.streak + 1 or 1
        grantReward(player, streak)
end`,
  },
  {
    prompt: "Inventory grid GUI that fills itself",
    tag: "GUI",
    lines: 33,
    ms: 760,
    code: `local grid = screenGui.Inventory.Grid
local UILL = Instance.new("UIGridLayout")
UILL.CellSize = UDim2.fromOffset(64, 64)
UILL.CellPadding = UDim2.fromOffset(8, 8)
UILL.Parent = grid
for _, item in inventory do
        makeSlot(item):Clone().Parent = grid
end`,
  },
  {
    prompt: "Sprint with a draining stamina bar",
    tag: "Movement",
    lines: 44,
    ms: 880,
    code: `UserInputService.InputBegan:Connect(function(input)
        if input.KeyCode == Enum.KeyCode.LeftShift then
                sprinting = true
        end
end)
RunService.Heartbeat:Connect(function(dt)
        stamina = math.clamp(stamina + (sprinting and -20 or 12) * dt, 0, 100)
        humanoid.WalkSpeed = stamina > 0 and sprinting and 24 or 16
end)`,
  },
  {
    prompt: "Pet that follows with a BodyGimbal spring",
    tag: "Systems",
    lines: 58,
    ms: 1140,
    code: `local function followPet(pet, root)
        RunService.Heartbeat:Connect(function()
                local target = root.CFrame * CFrame.new(2.5, 1.5, 2)
                pet.CFrame = pet.CFrame:Lerp(target, 0.08)
                pet.CFrame = CFrame.lookAt(pet.Position,
                        root.Position + Vector3.yAxis * 0.5)
        end)
end`,
  },
  {
    prompt: "DataStore profile with retry + session lock",
    tag: "Data",
    lines: 61,
    ms: 1230,
    code: `local function withRetry(fn, attempts)
        for i = 1, attempts do
                local ok, result = pcall(fn)
                if ok then return result end
                task.wait(2 ^ i + math.random())
        end
        error("DataStore gave up after " .. attempts)
end`,
  },
  {
    prompt: "Teleporter pad pair with visual cooldown ring",
    tag: "Systems",
    lines: 29,
    ms: 700,
    code: `padA.Touched:Connect(function(hit)
        local root = hit.Parent:FindFirstChild("HumanoidRootPart")
        if not root or cooldowns[hit.Parent] then return end
        cooldowns[hit.Parent] = true
        root.CFrame = padB.CFrame + Vector3.new(0, 4, 0)
        task.delay(3, function() cooldowns[hit.Parent] = nil end)
end)`,
  },
];

/* ------------------------------------------------------------------ */

export const STATS = [
  { value: 12847391, label: "scripts generated", format: "int" as const, note: "and counting, unmetered" },
  { value: 214530, label: "builders onboard", format: "int" as const, note: "solo devs to full studios" },
  { value: 98.2, label: "first-try compile rate", format: "pct" as const, note: "measured on 1M generations" },
  { value: 0, label: "dollars ever charged", format: "money" as const, note: "free forever, literally" },
];

/* ------------------------------------------------------------------ */

export type CellMark = "yes" | "no" | "part";

export interface CompareRow {
  label: string;
  forge: [CellMark, string];
  chat: [CellMark, string];
  paid: [CellMark, string];
}

export const COMPARE: CompareRow[] = [
  { label: "Price", forge: ["yes", "$0 — forever"], chat: ["part", "Free tier, then meters you"], paid: ["no", "$10–20 / seat / month"] },
  { label: "Token meter / limits", forge: ["yes", "None. The counter doesn't exist"], chat: ["no", "Hard caps + rate limits"], paid: ["part", "“Fair use” throttling"] },
  { label: "Luau-specific training", forge: ["yes", "Trained on public Luau corpus"], chat: ["part", "Generic Lua, guesses Luau APIs"], paid: ["part", "Varies wildly by vendor"] },
  { label: "Reads your DataModel", forge: ["yes", "Explorer + selection context"], chat: ["no", "You paste everything manually"], paid: ["part", "File-level only"] },
  { label: "Writes into the Explorer", forge: ["yes", "Inserts scripts + undo waypoints"], chat: ["no", "Copy-paste workflow"], paid: ["part", "Edits open text files only"] },
  { label: "--!strict typed output", forge: ["yes", "Always, analyzer-clean"], chat: ["part", "If you beg for it"], paid: ["part", "Hit or miss"] },
  { label: "Offline fallback", forge: ["yes", "On-device template model"], chat: ["no", "Cloud-only"], paid: ["no", "Cloud-only"] },
  { label: "Privacy posture", forge: ["yes", "Prompts only — place never uploaded"], chat: ["part", "Depends on your plan"], paid: ["part", "Reads whole workspace"] },
  { label: "Account / API key", forge: ["yes", "Neither required"], chat: ["no", "Account required"], paid: ["no", "Account + key + billing"] },
];

/* ------------------------------------------------------------------ */

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Is it actually free forever? What's the catch?",
    a: "Yes — $0, no token meter, no credit card, no “pro tier” hiding the good model. Inference runs on a community GPU pool funded by optional cosmetic Forge Passes (name colors, widget themes) and sponsorships. The model weights are open, so even if the pool ever shut down, you can self-host the exact same brain on your own hardware.",
  },
  {
    q: "No tokens — then how does it not run out of money?",
    a: "Three tricks: the model is a distilled 3.8B specialist that's cheap to run; prompts are deduplicated and cached across the community (a “damage pad” answer is computed once, served millions of times); and generation is batched across idle GPU hours. The cost per script works out to a fraction of a cent — which the Forge Pass cosmetics round up to zero for you.",
  },
  {
    q: "How does a plugin actually do the work inside Studio?",
    a: "LuauForge ships as a standard Roblox Studio plugin. It creates a DockWidgetPluginGui panel, reads your Explorer selection through the plugin API, talks to the inference pool over HttpService, and then uses Instance.new + Parent assignment to drop generated Scripts, ModuleScripts and LocalScripts directly into your place — with ChangeHistoryService waypoints so every insert is one Ctrl+Z away.",
  },
  {
    q: "Does it know Luau, or just generic Lua?",
    a: "Luau, specifically. It was fine-tuned on the public Roblox code corpus: task library over the deprecated globals, :: casts and exported types, attributes and CollectionService tags, OnServerEvent validation patterns, DataStore session locks, Rojo project layouts. It will refuse to emit wait(0.03) on principle.",
  },
  {
    q: "Is this allowed under Roblox's Terms of Service?",
    a: "Yes. Plugins are a first-class, documented Studio feature; LuauForge only uses the official plugin API, only runs while Studio is open, and never touches the runtime client. It explicitly refuses to generate executors, exploits, or anything that violates Roblox Community Standards — those requests get a polite no.",
  },
  {
    q: "What do you do with my code?",
    a: "Nothing you didn't send. Your place file is never uploaded — only the prompt and the selected text you ask about travel over HTTPS, and they're purged from the pool after caching. Telemetry (latency, compile-rate) is opt-in and anonymous. There's a full privacy note in the plugin header and you can run in zero-telemetry mode with one checkbox.",
  },
  {
    q: "Does it work offline?",
    a: "Partially, by design. v2.4 ships a distilled on-device template model that covers the ~200 most-requested patterns (leaderstats, touch handlers, tween helpers) with zero network. Full free-form generation needs the pool — but your prompts queue up and fire the second you're back online.",
  },
];

/* ------------------------------------------------------------------ */

export const TICKER_ITEMS = [
  "NO TOKENS",
  "NO API KEY",
  "NO SUBSCRIPTION",
  "RUNS INSIDE STUDIO",
  "READS YOUR DATAMODEL",
  "STRICT-TYPED OUTPUT",
  "UNDO-FRIENDLY WRITES",
  "TOS-SAFE BY DESIGN",
  "OPEN WEIGHTS",
  "OFFLINE FALLBACK",
];

export const CHANGELOG = [
  { v: "v2.4.1", date: "Feb 2026", note: "Offline template model, 31% faster first-token on the community pool." },
  { v: "v2.4.0", date: "Jan 2026", note: "Diff view for error fixes; multi-file refactor suggestions." },
  { v: "v2.3.2", date: "Dec 2025", note: "Team Create awareness; respects script permissions per-user." },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Library", href: "#library" },
  { label: "Compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];
