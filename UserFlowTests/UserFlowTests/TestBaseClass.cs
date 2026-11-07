using AwesomeAssertions;
using NUnit.Framework.Interfaces;

namespace UserFlowTests;

public abstract class TestBaseClass(string seed)
{
    protected GameInstance Game { get; private set; } = null!;

    [SetUp]
    public void StartGame() => Game = new GameInstance(seed).AssureGameInitialised();

    [TearDown]
    public void StopGame()
    {
        try
        {
            if (TestContext.CurrentContext.Result.Outcome.Status != TestStatus.Failed)
                Game.RuntimeErrors.Should().BeEmpty();
        }
        finally { Game.Dispose(); }
    }
}