using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UserFlowTests;

public class TestFixture(string seed) : IDisposable, IAsyncDisposable
{
    public GameInstance GameInstance { get; init; } = new (seed);

    /// <inheritdoc />
    public void Dispose()
    {
        GameInstance.Dispose();
    }
    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        await GameInstance.DisposeAsync();
    }
}