from .file2 import myfunc, myfunc3


def myfunc2():
    return 10 + myfunc(4)


def main():
    print(myfunc2(), myfunc3())


if __name__ == "__main__":
    main()
