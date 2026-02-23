#include <iostream>
using namespace std;

int main() {
    string name;
    int marks[5];
    int total = 0;
    float average;
    char grade;

    cout << "Enter student name: ";
    cin >> name;

    cout << "Enter marks for 5 subjects:\n";
    for(int i = 0; i < 5; i++) {
        cout << "Subject " << i + 1 << ": ";
        cin >> marks[i];
        total += marks[i];
    }

    average = total / 5.0;

    if(average >= 90)
        grade = 'A';
    else if(average >= 75)
        grade = 'B';
    else if(average >= 60)
        grade = 'C';
    else if(average >= 50)
        grade = 'D';
    else
        grade = 'F';

    cout << "\n----- Result -----\n";
    cout << "Name: " << name << endl;
    cout << "Total Marks: " << total << endl;
    cout << "Average: " << average << endl;
    cout << "Grade: " << grade << endl;

    return 0;
}