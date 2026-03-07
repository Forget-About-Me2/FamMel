using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UserFlowTests;

[TestFixture]
public class RandomSeedDeterminismTest
{
    private IWebDriver _driver = null!;

    [SetUp]
    public void SetUp()
    {
        _driver = new ChromeDriver();
    }

    [TearDown]
    public void TearDown()
    {
        _driver.Quit();
    }

    [Test]
    public void SeededRandom_IsRepeatable_AndDifferentAcrossSeeds()
    {
        _driver.Navigate().GoToUrl("http://localhost:8080?seed=1");

        var seqA = SequenceForSeed(20260307, 12, 1000);
        var seqB = SequenceForSeed(20260307, 12, 1000);
        var seqC = SequenceForSeed(20260308, 12, 1000);

        Assert.That(seqB, Is.EqualTo(seqA), "Same seed should reproduce the same random sequence.");
        Assert.That(seqC, Is.Not.EqualTo(seqA), "Different seeds should produce a different random sequence.");
    }

    [Test]
    public void QueryParamSeed_IsDeterministicAcrossReloads()
    {
        _driver.Navigate().GoToUrl("http://localhost:8080?seed=4242");
        var first = SequenceFromCurrentState(10, 500);

        _driver.Navigate().Refresh();
        var second = SequenceFromCurrentState(10, 500);

        Assert.That(second, Is.EqualTo(first), "Reloading with the same seed query should replay the same sequence.");
    }

    private string SequenceForSeed(int seed, int count, int maxExclusive)
    {
        _driver.SetGameSeed(seed);
        return SequenceFromCurrentState(count, maxExclusive);
    }

    private string SequenceFromCurrentState(int count, int maxExclusive)
    {
        var script = $"return Array.from({{ length: {count} }}, () => randomInt({maxExclusive})).join(',');";
        return (string)((IJavaScriptExecutor)_driver).ExecuteScript(script)!;
    }
}
