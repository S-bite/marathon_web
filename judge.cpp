#include <bits/stdc++.h>
using namespace std;
const int H = 512;
const int W = 512;

//Rect自体は左端が(0,0)で、
//(y1,x1)が操作矩形の左上座標、(y2,x2)が操作矩形の右下座標
bool isValidMove(int y1, int x1, int y2, int x2)
{
    if ((y1 < 0 || y1 >= H) || (x1 < 0 || x1 >= W) || (y2 < 0 || y2 >= H) || (x2 < 0 || x2 >= W))
    {
        return false;
    }

    if (y1 > y2 || x1 > x2)
    {
        return false;
    }
    return true;
}
void update(vector<vector<int>> &rect, int y1, int x1, int y2, int x2)
{
    for (int i = y1; i <= y2; i++)
    {
        for (int j = x1; j <= x2; j++)
        {
            rect[i][j] ^= 1;
        }
    }
}

int calcScore(vector<vector<int>> &rect)
{
    int score = 0;
    for (int i = 0; i < H; i++)
    {
        for (int j = 0; j < W; j++)
        {
            if ((i + j) % 2 == 0)
            {
                score += rect[i][j];
            }
            else
            {
                score += 1 - rect[i][j];
            }
        }
    }
    return score;
}

int getIntFromStream()
{
    string rawStr;
    cin >> rawStr;
    if (rawStr == "")
    {
        cout << "WA_EOFWhileParse" << endl;
        cout << -1 << endl;
        exit(0);
    }

    try
    {
        int num = stoi(rawStr);
        return num;
    }
    catch (...)
    {
        cout << "WA_NotANumber" << endl;
        cout << rawStr << endl;
        exit(0);
    }
}

int main()
{
    int lines = getIntFromStream();
    vector<vector<int>> rect(H, vector<int>(W, 0));
    for (int i = 0; i < lines; i++)
    {
        int y1 = getIntFromStream(), x1 = getIntFromStream(), y2 = getIntFromStream(), x2 = getIntFromStream();
        if (isValidMove(y1, x1, y2, x2) == false)
        {
            cout << "WA_InvalidMove" << endl;
            cout << y1 << " " << x1 << " " << y2 << " " << x2 << endl;
            exit(0);
        }
        update(rect, y1, x1, y2, x2);
    }
    cout << "AC" << endl;
    cout << calcScore(rect) << endl;
    return 0;
}