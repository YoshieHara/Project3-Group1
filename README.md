# **Project 3**
# **Title: Victoria Safety Analysis**

## **Group 1: Hussam Goda, Kashif Bashir, Nairui Guo and Yoshie Hara**


### **Introduction and Objective**
Safety is an important aspect in any country/location. As people's behaviors, beliefs, and life standards vary, achieving a completely crime-free location is almost impossible. However, safety data analysis can serve as a valuable resource for governments, law enforcement agencies, and police forces to assess and adapt their strategies to combat crimes and enhance safety.

This project consists of two significant parts. The first part looks at assessing all types of crimes recorded in Victoria over the last few years. The assessment considers two major aspects; determine the occurrence of each crime type relative to other crime types, and how occurrence/trend of each crime type changed over the years.
Crimes related to drugs have emerged as a significant and more prominent issue in recent years. Moreover, Drugs not only affect community safety but also people's health and wellbeing, which in turn may add additional strains on the Public Health System. With that in mind, the second part of the project focuses on assessing drug crimes in a similar fashion as explained in the first part.

This project uses information reported by the Crime Statistics Agency in relation to offences/crimes recorded in Victoria. Data are collected in the form of Excel files. Two Excel files are used in this study; the first file (crimes.xlsx) reports all types of crimes, while the second file (Drugs.xlsx) takes a deeper look into the crimes related to drugs. The data are reported over a few years ending March 2023.

Data used in this project are gathered from the following website (the source): https://www.crimestatistics.vic.gov.au/crime-statistics/latest-victorian-crime-data/download-data 

The objective of this project is to use available data to investigate the following. 
1. The relative occurrence of different crime categories in Victoria according to Offence Division (per year)
2. Year-to-year changes in offence counts for each Offence Division
3. The relative occurrence of drug crimes according to Drug Offence Groups, and
4. Year-to-year change in offence counts for each Drug Offence Group (per year).

As per the project requirements, this project uses the second track: "A dashboard with multiple charts that update from the same data".


### **Project Files**
The following list declares all files used to address the objectives stated above. Please be aware that all the these files are included in the folder "Project_3_Group_1_Final_Material".

1. crimes.xlsx: This is an Excel file reporting crimes in Victoria from 2014 to 2023. 
2. Drugs.xlsx: This is an Excel file reporting drugs-related crimes from 2014 to 2023
3. DataCleaningAndConversion.ipynb: A jupyter notebook used to prepare data 
4. crimes.csv: CSV file for crimes (output from DataCleaningAndConversion.ipynb) 
5. drugs.csv: CSV file for drugs-related crimes (output from DataCleaningAndConversion.ipynb) 
6. crime.sqlite: An SQLite database to host both CSV files indicated above
7. AllCrimes.py: A Python code to connect to crime.sqlite and generate Flask-API for inclusion in the java script to generate the dashboard 
8. index.html: An HTML file to activate and run demo.js
9. style.css: A CSS file to style the dashboard
10. demo.js: A java script file contains all codes to construct the dashboard (four plots in total). The library chart.js is used.


### **How To Use Files - Workflow**
All files must be in the same folder in order for the files to work in harmony. 
1. The jupyter notebook file "DataCleaningAndConversion.ipynb" is used first. The file reads both Excel files "crimes.xlsx" and "Drugs.xlsx" and converts them into DataFrames. Once in DataFrames, data are QC'ed and data types for all entries in both tables are checked to confirm their suitability. Empty rows, if any, are dropped. finally both DataFrames are exported in CSV format. Two files are produced, "crimes.csv" and "drugs.csv". 
2. The two CSV  files are then imported into the SQLite database "crime.sqlite". Tables are produced and, again, all data types are checked. In the database, the table for "crimes.csv" is named "cleaned_data", while the table for "drugs.csv" is called "drugs". The table "cleaned_data" has 1123 records. The table "drugs" has 2073 records. Below are two screen captures that show data types in both tables and a few rows from the table "cleaned_data".
   

   
   ![image](https://github.com/YoshieHara/Project3-Group1/assets/134576485/3e44167f-24d2-4879-987d-310b319322b0)
   
   

   ![image](https://github.com/YoshieHara/Project3-Group1/assets/134576485/d96455af-01aa-40f8-9726-18d7384b24ac)

 
3. Once the Database is ready, the file "AllCrimes.py" is developed to connect to the database, introduce two routes and produce two Flask-API links for both tables. Of course, tables entries through the links are in json format. The two Flask-API routes are then used in the javascript file. The two links are:
  
  http://localhost:5000/api/v1.0/CrimesInVictoria
  
  http://localhost:5000/api/v1.0/DrugsOffencesVictoria

The first image below is from the "AllCrimes.py" showing defined routes for both tables. The second image shows a section of the second Flask-API link as it is read in json format. Please be aware that in order for the dashboard to work, AllCrimes.py has to be active and running.
  
![image](https://github.com/YoshieHara/Project3-Group1/assets/134576485/a16c82e0-d233-4d5f-90ee-c7fb52930548)


![image](https://github.com/YoshieHara/Project3-Group1/assets/134576485/a7e26f55-0191-4202-a516-3530d370e4b0)

4.There are external files linked to index.html.

・style.css - It is used for describing the presentation and styling of web documents written in index.html.

・demo.js - It is used to create and update line charts, pie charts, and bar charts with chart.js library, based on data obtained from two different API endpoints. 
               These charts visualize various aspects of crime data for Victoria.


5.These are the final outcomes of the data visualisation. below shows four graphs which displays the data of the two data files, "crimes.csv" and "drugs.csv":
   The first two graphs display a Pie graph displaying the different Crime types being project as a Pie Graph and the crime trends over the years as a Line Graph. The Pie Graph have a drop down list which can filter the different years. The Line Graph also have a drop down list which filters the different crime types.
![image](https://github.com/YoshieHara/Project3-Group1/assets/132328885/0612d074-26ec-432c-a82c-b45551ec62c8)

![image](https://github.com/YoshieHara/Project3-Group1/assets/132328885/2d930994-4d9f-4d5c-8b26-eccd3ee8bb21)

   The last two graphs display a Bar graph of the different drug offences and a line graph for the Drug crime trends over the years. The Line Graph have a drop-down list which can filter the different years, and the Line Graph also have a drop down list which filters the different Drug crime types.
![image](https://github.com/YoshieHara/Project3-Group1/assets/132328885/968700b8-329e-49ff-a32e-a2fa00b748c6)

![image](https://github.com/YoshieHara/Project3-Group1/assets/132328885/16dfe643-f936-40f4-a6bf-b3baeebbbd0d)

   *All graphs have a interactive display box when you hover your mouse over it to show further information or statistics.

6. Conclusion:
     In summary, safety data analysis is vital for adaptive government and law enforcement strategies. With a recent surge in drug-related crimes, our study, using Crime Statistics Agency data from Victoria up to March 2023, aims to inform better interventions and boost community safety.
