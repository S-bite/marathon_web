from random import randint


def isValidMove(y1, x1, y2, x2):
    H = 512
    W = 512
    if ((y1 < 0 or y1 >= H) or (x1 < 0 or x1 >= W) or (y2 < 0 or y2 >= H) or (x2 < 0 or x2 >= W)):
        return False
    if (y1 > y2 or x1 > x2):
        return False
    return True


def genMove():
    moveNum = randint(500, 1000)
    move = "{}\n".format(moveNum)
    for i in range(moveNum):
        y1 = randint(0, 511)
        x1 = randint(0, 511)
        y2 = randint(0, 511)
        x2 = randint(0, 511)
        while (not isValidMove(y1, x1, y2, x2)):
            y1 = randint(0, 511)
            x1 = randint(0, 511)
            y2 = randint(0, 511)
            x2 = randint(0, 511)
        if (randint(0, 9999) == 0):
            pass
        else:
            move += "{} {} {} {}\n".format(y1, x1, y2, x2)
    return move
