Strings

Reverse words in a string (words are separated by one or more spaces). Now do it in-place. By far the most popular string question!
Reverse a string
Strip whitespace from a string in-place
void StripWhitespace(char* szStr)
Remove duplicate chars from a string ("AAA BBB" -> "A B")
int RemoveDups(char* szStr)
Find the first non-repeating character in a string:("ABCA" -> B )
int FindFirstUnique(char* szStr)
More Advanced Topics:
You may be asked about using Unicode strings. What the interviewer is usually looking for is:
each character will be two bytes (so, for example, char lookup table you may have allocated needs to be expanded from 256 to 256 * 256 = 65536 elements)
that you would need to use wide char types (wchar_t instead of char)
that you would need to use wide string functions (like wprintf instead of printf)
Guarding against being passed invalid string pointers or non nul-terminated strings (using walking through a string and catching memory exceptions