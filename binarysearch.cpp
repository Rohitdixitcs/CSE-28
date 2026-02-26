#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, i, pos = -1, num;
    cin >> n;

    int a[n];  // Works in GCC, but not standard C++

    for (i = 0; i < n; i++)
    {
        cin >> a[i];
    }

    cout << "Enter element which you want to search: ";
    cin >> num;

    for (i = 0; i < n; i++)
    {
        if (a[i] == num)
        {
            pos = i;
            break;
        }
    }

    if (pos != -1)
        cout << num << " found at location " << pos + 1;
    else
        cout << "Element not found";

    return 0;
}