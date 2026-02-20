import urllib.parse

def encode(pw: str) -> str:
    return urllib.parse.quote_plus(pw)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("usage: python encode_password.py '<password>'")
    else:
        print(encode(sys.argv[1]))
