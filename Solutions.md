Solutions

Sandbox1.js Solution:

    const formatter = (array) => {
    
        if (array.length === 1) return array.toString();
        else if (array.length === 2) return array.join(" and ");
        else return array.join(", ").replace(/,(?=[^,]*$)/, " and");
    
    };

Sandbox2.js Solution:

    const getLongestString = (array) => {
    
        let longest = "";
    
        array.forEach((item) => {
            if(item.length > longest.length) {
                longest = item;
            }
        });
    
        return longest;
    };

Sandbox3.js Solution:

    const getMostCommonCharacter = (string) => {
    
        const charCount = {};
        let maxCharCount = 0;
        let maxChar = "";
    
        for(let i = 0; i < string.length; i++) {
            charCount[string[i]] = ++charCount[string[i]] || 1;
        }
    
        for(let key in charCount) {
            if(charCount[key] >= maxCharCount) {
                maxCharCount = charCount[key];
                maxChar = key;
            }
        }
    
        return maxChar;
    };

Sandbox4.js Solution:

    const isItAnAnagram = (String1, String2) => {
    
        let string1 = String1.toLowerCase().replace(/ /g, "");
        let string2 = String2.toLowerCase().replace(/ /g, "");
    
        if(string1.length !== string2.length) return false;
    
        let sort1 = string1.split("").sort();
        let sort2 = string2.split("").sort();
    
        return sort1.join("") === sort2.join("");
    };

Sandbox5.js Solution:

    const isItAPalindrome = (String) => {

        let trimmed = String.toLowerCase().replace(/[^\w]/g, "");

        return trimmed === trimmed.split("").reverse().join("");

    };

Sandbox6.js Solution:

    const reverseString = (string) => {
    
        let newString = "";
    
        for (let i = 0; i <= string.length - 1; i++) {
        newString += string[string.length - i -1];
        }
    
        return newString;
    };
