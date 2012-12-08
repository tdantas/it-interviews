Suppose you have some huge files, each 4GB, and you have to calculate the age average per country.

The File Format is

````
id | country   | age
---------------------
01 | Jamaica   | 28
02 | Brazil    | 47
03 | Portugal  | 33
04 | Argentina | 56
05 | USA       | 12
06 | Portugal  | 82
07 | Brazil    | 09
10 | Germany   | 18
…  |    …      |  …     
      
````

ps: You are not allowed to use RDBMS to solve this question.
 
 Import all data and query
  
  	select  country ,AVG(age) from ImportedData group by country  
 