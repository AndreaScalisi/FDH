# Influencers of the past

The goal of this project is to show who were the notable people in Paris in 1884 and 1908 and where they lived.

This repository contains all the tools that we used to parse the data. You can take a look at the final result <a href="https://andreascalisi.github.io"> here</a>. The code for the interface can be found <a href="https://github.com/AndreaScalisi/andreascalisi.github.io">here</a>, and contains as well the code to display people on the maps.

## Structure

This repository contains three main files, as well as the original sources from the OCR in <a href="https://github.com/AndreaScalisi/FDH/tree/master/data/raw">/data/raw/</a>. Since the sources had two different formats (xlsx and txt), we have two different parsers.

### parser_1884.ipynb

Contains the code used to parse the data from 1884 (xslx).

### parser_1908.ipynb

Contains the code used to parse the data from 1908 (txt).

### get_coord.ipynb

Contains the code used to get the coordinates of all addresses after parsing. You will see the outputs of this script in <a href="https://github.com/AndreaScalisi/FDH/tree/master/data">/data/</a>. 

## Wiki page

More informations on our <a href="http://fdh.epfl.ch/index.php/Influencers_of_the_past">wiki page</a>.

## Authors

Made by Giacomo Alliata and Andrea Scalisi, EPFL 2019.
