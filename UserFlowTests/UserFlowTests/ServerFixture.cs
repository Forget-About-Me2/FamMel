using System.Diagnostics;

namespace UserFlowTests;

/// <summary>The origin (scheme + host + port) for the test web server.</summary>
public static class ServerUrl
{
    public const string Origin = "http://127.0.0.1:8081";
}

[SetUpFixture]
public class ServerFixture
{
    private static Process? _serverProcess;
    private static bool _weStartedServer;

    [OneTimeSetUp]
    public void RunBeforeAnyTests()
    {
        if (IsServerRunning())
        {
            Console.WriteLine("Server is already running on " + ServerUrl.Origin + " — reusing existing instance.");
            _weStartedServer = false;
            return;
        }

        StartServer();
    }

    [OneTimeTearDown]
    public void RunAfterAnyTests()
    {
        if (_weStartedServer)
            KillServer();
    }

    private static bool IsServerRunning()
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
            var response = client.GetAsync(ServerUrl.Origin + "/index.html")
                .GetAwaiter().GetResult();
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private static void StartServer()
    {
        var projectRoot = FindProjectRoot();
        Console.WriteLine($"Starting web server from {projectRoot}...");

        var psi = new ProcessStartInfo
        {
            FileName = "npx.cmd",
            Arguments = "live-server --no-browser --port=8081",
            WorkingDirectory = projectRoot,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        _serverProcess = new Process { StartInfo = psi };
        _serverProcess.Start();

        var timeout = DateTime.UtcNow.AddSeconds(15);
        while (DateTime.UtcNow < timeout)
        {
            if (IsServerRunning())
            {
                Console.WriteLine($"Web server is ready on {ServerUrl.Origin}");
                _weStartedServer = true;
                return;
            }

            Thread.Sleep(250);
        }

        _serverProcess.Kill(entireProcessTree: true);
        _serverProcess.Dispose();
        _serverProcess = null;

        throw new InvalidOperationException(
            "Web server failed to start within 15 seconds. " +
            "Check that npx.cmd and live-server are available.");
    }

    private static void KillServer()
    {
        if (_serverProcess is { HasExited: false })
        {
            _serverProcess.Kill(entireProcessTree: true);
            _serverProcess.Dispose();
            _serverProcess = null;
            Console.WriteLine("Web server stopped.");
        }
    }

    private static string FindProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (File.Exists(Path.Combine(dir.FullName, "package.json")))
                return dir.FullName;
            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException(
            $"Could not find project root (package.json) starting from {AppContext.BaseDirectory}");
    }
}
