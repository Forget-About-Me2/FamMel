using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using AwesomeAssertions;

namespace UserFlowTests;

[TestFixture]
public class YourHomeIntegrationTests
{
    private const string BaseUrl = "http://127.0.0.1:8080/index.html?seed=20260308";
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
    public void PreDrink_ShowsDialogue_AndContinueChoice()
    {
        StartGameAtYourHome();

        _driver.ClickWhenInteractable(By.LinkText("Drink some water"));

        var text = WaitForStoryText();
        text.Should().NotBeNullOrWhiteSpace("pre-drink should show dialogue text");
        var lowered = text.ToLowerInvariant();
        (lowered.Contains("water") || lowered.Contains("stomach") || lowered.Contains("drink"))
            .Should().BeTrue("pre-drink text should mention water/drink context");

        _driver.ClickWhenInteractable(By.LinkText("Continue..."));
        _driver.ClickWhenInteractable(By.LinkText("Call her on the phone"));

        AssertNoRuntimeErrors();
    }

    [Test]
    public void IncomingPhoneCall_AnswerPath_ShowsCantWaitDialogue_WithoutErrors()
    {
        StartGameAtYourHome();

        ((IJavaScriptExecutor)_driver).ExecuteScript("window.cellphone && window.cellphone();");
        ((IJavaScriptExecutor)_driver).ExecuteScript("window.anscell && window.anscell();");

        var text = WaitForStoryText();
        text.Should().NotBeNullOrWhiteSpace("answering the call should show dialogue");
        var lowered = text.ToLowerInvariant();
        (lowered.Contains("trying to wait") || lowered.Contains("hold") || lowered.Contains("pee"))
            .Should().BeTrue("answer dialogue should contain hold/pee context");

        AssertNoRuntimeErrors();
    }

    private void StartGameAtYourHome()
    {
        _driver.Navigate().GoToUrl(BaseUrl);
        _driver.Manage().Window.Size = new System.Drawing.Size(1600, 1000);

        ((IJavaScriptExecutor)_driver).ExecuteScript(@"
            window.__testErrors = [];
            window.addEventListener('error', function (e) {
                window.__testErrors.push(String(e.message || e.error || 'unknown error'));
            });
            window.addEventListener('unhandledrejection', function (e) {
                window.__testErrors.push(String(e.reason || 'unhandled rejection'));
            });
        ");

        _driver.ClickWhenInteractable(By.Id("start"));
        _driver.ClickWhenInteractable(By.Id("close-pop-up"));
        _driver.ClickWhenInteractable(By.LinkText("Start the game."));
    }

    private void AssertNoRuntimeErrors()
    {
        var script = "return (window.__testErrors || []).join(' || ');";
        var errors = ((IJavaScriptExecutor)_driver).ExecuteScript(script)?.ToString() ?? string.Empty;
        errors.Should().BeEmpty($"browser runtime errors detected: {errors}");
    }

    private string WaitForStoryText(int timeoutMs = 3000)
    {
        var start = DateTime.UtcNow;
        while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs)
        {
            try
            {
                var text = _driver.FindElement(By.Id("textsp")).Text;
                if (!string.IsNullOrWhiteSpace(text))
                {
                    return text;
                }
            }
            catch (NoSuchElementException)
            {
            }

            Thread.Sleep(100);
        }

        return _driver.FindElement(By.Id("textsp")).Text;
    }
}
