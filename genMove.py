from random import randint

H = 128
W = 128


def isValidMove(y1, x1, y2, x2):
    if ((y1 < 0 or y1 >= H) or (x1 < 0 or x1 >= W) or (y2 < 0 or y2 >= H) or (x2 < 0 or x2 >= W)):
        return False
    if (y1 > y2 or x1 > x2):
        return False
    return True


def genMove():
    moveNum = randint(250, 500)
    move = "{}\n".format(moveNum)
    for i in range(moveNum):
        y1 = randint(0, H-1)
        x1 = randint(0, W-1)
        y2 = randint(0, H-1)
        x2 = randint(0, W - 1)
        moveType = randint(0, 3)
        while (not isValidMove(y1, x1, y2, x2)):
            y1 = randint(0, H-1)
            x1 = randint(0, W-1)
            y2 = randint(0, H-1)
            x2 = randint(0, W-1)
        else:
            move += "{} {} {} {} {}\n".format(y1, x1, y2, x2, moveType)
    return move


if __name__ == "__main__":
    print(genMove())
