#***********FOR VIEWERS WANTING TO RUN CODE ON THIS PROJECT**************
# Enter the following command to install of the requirements of this project, make sure you are in the 2_Analysis folder!
# pip install -r dependencies.txt

#**********FOR DEVELOPERS OF THIS PROJECT*************
# Begin by making sure pip-tools is installed, if not, then enter command below:
# pip install pip-tools

# Then create file called 'dependencies.in'
# Type in all of the dependencies you want for the project, don't worry about the version yet

# Enter the following command, this will create a txt file with all of the dependency versions you will need:
# pip-compile dependencies.in

# Then enter the following command to install all of the dependencies from the txt file:
# pip install -r dependencies.txt