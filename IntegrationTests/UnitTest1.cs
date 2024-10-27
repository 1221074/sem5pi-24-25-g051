using Xunit;

namespace sem5pi_24_25_g051.IntegrationTests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        
        // Arrange
        var a = 1;
        var b = 2;
        var expected = 3;
        // Act
        var actual = a + b;
        // Assert
        Assert.Equal(expected, actual);
    }
}