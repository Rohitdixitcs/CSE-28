#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, i, num, pos = -1, mid, beg, end;
    cin >> n;

    int a[n];

    for (i = 0; i < n; i++)
        cin >> a[i];

    cout << "Enter the number you want to search: ";
    cin >> num;

    beg = 0;
    end = n - 1;

    while (beg <= end)
    {
        mid = (beg + end) / 2;

        if (a[mid] == num)
        {
            pos = mid;
            break;
        }
        else if (a[mid] < num)
            beg = mid + 1;
        else
            end = mid - 1;
    }

    if (pos != -1)
        cout << "Element found at position " << pos + 1;
    else
        cout << "Element not found";

    return 0;
}