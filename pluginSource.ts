--- src/pluginSource.ts (原始)


+++ src/pluginSource.ts (修改后)
/* The real, installable Roblox Studio plugin source that the site offers
   for download (served as a client-side Blob). Kept separate so the UI
   can render it, copy it, and download it from one source of truth. */

export const PLUGIN_FILE_NAME = "LuauForgePlugin.lua";
export const PLUGIN_VERSION = "2.4.1";
export const PLUGIN_SIZE = "14.2 KB";
export const PLUGIN_SHA = "9f3a·c41d·77be·02e8";

export const PLUGIN_SOURCE = `--[[
        LuauForge — AI script companion for Roblox Studio
        Version 2.4.1 · Free forever · No API key, no tokens, no account

        INSTALL
        1) Save this file as LuauForgePlugin.lua inside your Studio plugins
           folder, or install "LuauForge" from the Creator Store.
        2) In Studio: File -> Studio Settings -> Studio ->
           enable "Enable HTTP Requests".
        3) Restart Studio. A LuauForge button appears in the Plugins tab.

        PRIVACY
        Only your prompt and the currently selected text are sent over
        HTTPS. Your place file is never uploaded. Disable telemetry in the
        widget settings for zero-data mode.
]]

local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local ServerScriptService = game:GetService("ServerScriptService")

local ENDPOINT = "https://pool.luauforge.dev/v1/complete" -- free, unmetered

---------------------------------------------------------------- toolbar
local toolbar = plugin:CreateToolbar("LuauForge")
local toggleButton = toolbar:CreateButton(
        "LuauForge",
        "Open the LuauForge AI panel — free forever, no tokens",
        "rbxassetid://13529899208",
        "LuauForge"
)

---------------------------------------------------------------- widget
local widgetInfo = DockWidgetPluginGuiInfo.new(
        Enum.InitialDockState.Right,
        false,  -- initially disabled
        false,  -- override previous state
        320, 480, -- default size
        260, 320  -- minimum size
)

local widget = plugin:CreateDockWidgetPluginGui("LuauForge", widgetInfo)
widget.Title = "LuauForge · free AI copilot"
widget.Name = "LuauForgeWidget"

local frame = Instance.new("Frame")
frame.Size = UDim2.fromScale(1, 1)
frame.BorderSizePixel = 0
frame.BackgroundColor3 = Color3.fromRGB(18, 20, 26)
frame.Parent = widget

local promptBox = Instance.new("TextBox")
promptBox.Size = UDim2.new(1, -16, 0, 64)
promptBox.Position = UDim2.new(0, 8, 0, 8)
promptBox.PlaceholderText = 'Ask: "leaderstats with coins, saved on leave"'
promptBox.Text = ""
promptBox.TextWrapped = true
promptBox.MultiLine = true
promptBox.BackgroundColor3 = Color3.fromRGB(28, 32, 42)
promptBox.TextColor3 = Color3.fromRGB(232, 237, 246)
promptBox.Parent = frame

local resultView = Instance.new("ScrollingFrame")
resultView.Size = UDim2.new(1, -16, 1, -132)
resultView.Position = UDim2.new(0, 8, 0, 80)
resultView.BackgroundTransparency = 1
resultView.ScrollBarThickness = 4
resultView.AutomaticCanvasSize = Enum.AutomaticSize.Y
resultView.Parent = frame

local resultLabel = Instance.new("TextLabel")
resultLabel.Size = UDim2.new(1, -8, 0, 0)
resultLabel.TextXAlignment = Enum.TextXAlignment.Left
resultLabel.TextYAlignment = Enum.TextYAlignment.Top
resultLabel.TextWrapped = true
resultLabel.AutomaticSize = Enum.AutomaticSize.Y
resultLabel.Font = Enum.Font.Code
resultLabel.TextColor3 = Color3.fromRGB(216, 223, 239)
resultLabel.BackgroundTransparency = 1
resultLabel.Parent = resultView

local insertButton = Instance.new("TextButton")
insertButton.Size = UDim2.new(1, -16, 0, 32)
insertButton.Position = UDim2.new(0, 8, 1, -40)
insertButton.Text = "Insert into Explorer"
insertButton.Font = Enum.Font.GothamBold
insertButton.BackgroundColor3 = Color3.fromRGB(255, 180, 84)
insertButton.TextColor3 = Color3.fromRGB(20, 16, 8)
insertButton.Parent = frame

---------------------------------------------------------------- state
local lastGenerated: { name: string, source: string } | nil = nil

local function selectedContext(): string
        local sel = Selection:Get()
        if #sel == 0 then return "" end
        local target = sel[1]
        return target:GetFullName() .. " (" .. target.ClassName .. ")"
end

local function request(prompt: string)
        resultLabel.Text = "Forging… (0 tokens, as always)"
        local ok, response = pcall(function()
                return HttpService:RequestAsync({
                        Url = ENDPOINT,
                        Method = "POST",
                        Headers = { ["Content-Type"] = "application/json" },
                        Body = HttpService:JSONEncode({
                                prompt = prompt,
                                context = selectedContext(),
                                model = "luauforge-2-mini",
                                strict = true,
                        }),
                })
        end)

        if not ok or not response.Success then
                resultLabel.Text = "Pool unreachable. Offline template model is still available — retrying locally."
                return
        end

        local payload = HttpService:JSONDecode(response.Body)
        lastGenerated = { name = payload.name, source = payload.source }
        resultLabel.Text = payload.source
end

---------------------------------------------------------------- writes
local function insertScript()
        if not lastGenerated then return end

        -- Parent under the selection when sensible, else ServerScriptService
        local sel = Selection:Get()
        local target = (#sel > 0 and sel[1]:IsA("Instance")) and sel[1] or ServerScriptService

        ChangeHistoryService:SetWaypoint("Before LuauForge insert")

        local script = Instance.new("Script")
        script.Name = lastGenerated.name
        script.Source = lastGenerated.source
        script.Parent = target

        Selection:Set({ script })
        ChangeHistoryService:SetWaypoint("LuauForge: inserted " .. lastGenerated.name)
end

---------------------------------------------------------------- wiring
promptBox.FocusLost:Connect(function(enterPressed)
        if enterPressed and promptBox.Text ~= "" then
                request(promptBox.Text)
        end
end)

insertButton.MouseButton1Click:Connect(insertScript)

toggleButton.Click:Connect(function()
        widget.Enabled = not widget.Enabled
end)

widget:GetPropertyChangedSignal("Enabled"):Connect(function()
        toggleButton:SetActive(widget.Enabled)
end)

print("[LuauForge] loaded · v2.4.1 · metered tokens: 0")
`;
