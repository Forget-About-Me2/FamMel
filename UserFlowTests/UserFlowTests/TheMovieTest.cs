using OpenQA.Selenium;
using AwesomeAssertions;
using UserFlowTests;

[TestFixture]
public class TheMovieTest {
  private IWebDriver driver = null!;

  [SetUp]
  public void SetUp() {
    driver = DriverExtensions.CreateTestDriver();
  }

  [TearDown]
  protected void TearDown() {
    driver.Quit();
    driver.Dispose();
  }

  [Test]
  [Description("Exercises the theatre path end-to-end and asserts movie interaction choices advance without runtime errors.")]
  public void MovieScene_TheatreFlow_RendersAndAdvancesWithoutRuntimeErrors() {
    driver.Navigate().GoToUrl(ServerUrl.Origin + "/index.html?seed=3594826295");
    driver.Manage().Window.Size = new System.Drawing.Size(1936, 1048);

    ((IJavaScriptExecutor)driver).ExecuteScript(@"
      window.__testErrors = [];
      window.addEventListener('error', function (e) {
          window.__testErrors.push(String(e.message || e.error || 'unknown error'));
      });
      window.addEventListener('unhandledrejection', function (e) {
          window.__testErrors.push(String(e.reason || 'unhandled rejection'));
      });
    ");

    driver.ClickWhenInteractable(By.Id("start"));
    driver.DismissDisclaimerPopupIfPresent();
    driver.ClickWhenInteractable(By.LinkText("Start the game."));

    WaitForGameDataReady();
    PrimeMovieState();
    InvokeScene("theTheatre");

    TryClickFirstAvailable(By.Id("askMovie"), By.Id("chooseMovie"));
    TryClickFirstAvailable(By.Id("movieFavour"), By.Id("movieRomance"), By.Id("movieDoh"), By.Id("movieScary"), By.Id("movieSex"));
    TryClickFirstAvailable(By.Id("doMovie"));

    var text = WaitForStoryText();
    text.Should().NotBeNullOrWhiteSpace("movie scene flow should render dialogue text");

    var errors = ((IJavaScriptExecutor)driver).ExecuteScript("return (window.__testErrors || []).join(' || ');")?.ToString() ?? string.Empty;
    errors.Should().BeEmpty($"runtime errors detected in movie flow: {errors}");
  }

  private void InvokeScene(string sceneFunctionName) {
    var result = ((IJavaScriptExecutor)driver).ExecuteScript(@"
      const sceneName = arguments[0];
      try {
          const fn = window[sceneName];
          if (typeof fn !== 'function') {
              throw new Error('Missing scene function: ' + sceneName);
          }
          fn();
          return 'ok';
      } catch (e) {
          window.__testErrors = window.__testErrors || [];
          window.__testErrors.push(String((e && e.stack) || e));
          return 'fail';
      }
    ", sceneFunctionName)?.ToString();

    result.Should().Be("ok", $"scene function {sceneFunctionName} should execute without throwing");
  }

  private void PrimeMovieState() {
    ((IJavaScriptExecutor)driver).ExecuteScript(@"
      attraction = 140;
      shyness = 10;
      bladder = 0;
      yourbladder = 0;
      tummy = 0;
      yourtummy = 0;
      askholditcounter = 0;
      waitcounter = 0;
      gottagoflag = 0;
      changevenueflag = 0;
      if (Array.isArray(locStack) && locStack.length > 0) {
          locStack[0] = 'driveout';
      }
    ");
  }

  private void WaitForGameDataReady(int timeoutMs = 10000) {
    var start = DateTime.UtcNow;
    while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs) {
      var ready = ((IJavaScriptExecutor)driver).ExecuteScript(@"
        try {
          return typeof calledjsons !== 'undefined'
            && !!calledjsons['yourhome']
            && !!calledjsons['yourhome']['yourhome']
            && typeof objQuotes !== 'undefined'
            && !!objQuotes
            && typeof general !== 'undefined'
            && !!general;
        } catch {
          return false;
        }
      ");

      if (ready is bool isReady && isReady) {
        return;
      }

      Thread.Sleep(100);
    }

    false.Should().BeTrue("expected core JSON data to be ready for movie test");
  }

  private bool TryClickFirstAvailable(params By[] selectors) {
    var start = DateTime.UtcNow;
    while ((DateTime.UtcNow - start).TotalMilliseconds < 3000) {
      foreach (var selector in selectors) {
        if (driver.TryFindElement(selector, out _)) {
          driver.ClickWhenInteractable(selector);
          return true;
        }
      }
      Thread.Sleep(100);
    }

    return false;
  }

  private string WaitForStoryText(int timeoutMs = 3000) {
    var start = DateTime.UtcNow;
    while ((DateTime.UtcNow - start).TotalMilliseconds < timeoutMs) {
      try {
        var text = driver.FindElement(By.Id("textsp")).Text;
        if (!string.IsNullOrWhiteSpace(text)) {
          return text;
        }
      } catch (NoSuchElementException) {
      }

      Thread.Sleep(100);
    }

    return driver.FindElement(By.Id("textsp")).Text;
  }
}
