**Spotphish-ml training**

To start training the ML5 models:
1. Put all the images as test data set categorised as folders representing their correct class inside the folder *all_data*. 

*all_data* => *facebook* *google* *amazon ...*

2. run ./tree.sh from a linux environment to generate a tree of the all_data. This will create a tree_data.json that is fed to script.js for file paths.

2. run **python3 -m http.server** or **python -m http.server** for Python 3 **python -m SimpleHTTPServer 8000** for Python 2 to open a webpage that serves as the training page.