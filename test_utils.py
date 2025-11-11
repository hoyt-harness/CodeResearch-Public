"""Utility functions for CodeResearch testing."""


def add(a: int, b: int) -> int:
    """Add two numbers.

    Args:
        a: First number
        b: Second number

    Returns:
        Sum of a and b
    """
    return a + b


def multiply(a: int, b: int) -> int:
    """Multiply two numbers.

    Args:
        a: First number
        b: Second number

    Returns:
        Product of a and b
    """
    return a * b


def main():
    """Demonstrate basic operations."""
    x, y = 5, 3
    print(f"{x} + {y} = {add(x, y)}")
    print(f"{x} * {y} = {multiply(x, y)}")


if __name__ == "__main__":
    main()
