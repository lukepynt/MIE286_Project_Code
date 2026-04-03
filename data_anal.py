
from time import time

import matplotlib.pyplot as plt
import math

filename = "alldata.txt"

# CHANGE THIS TO THE PATH OF YOUR DATA FILE
file = open(filename, "r")
#file.write("Time: " + str(time.time()) + "\n")
data = file.read().splitlines()
r = []
squares = []
sum = 0
start = 0
end = 0
t = 0
nextstart = False
nextfinish = False
STARTRADIUS = 200

final_data = {}

def accuracy():
    if len(r) < 40:
        print(name)
        print(len(r))
        raise ValueError("Not enough data points to calculate accuracy.")
    
    rms = math.sqrt((sum / len(squares)));
    return 100*(1 - rms / STARTRADIUS);


    


for i in data:
    if (" ") in i:
        # its a name
        name = i
        final_data[name] = []
    elif i == "START":
        nextstart = True
    elif i == "FINISH":
        nextfinish = True
    elif nextstart:
        start = float(i)
        nextstart = False
    elif nextfinish:
        end = float(i)
        nextfinish = False

        t = (end-start)/1000 #convert to seconds
        

        acc = round(accuracy(), 3)
        final_data[name].append((acc, t))

        end = 0
        start = 0
        r = []
        squares = []
        sum = 0

    elif i == '':
        pass
    else:
        # i is a number
        i = float(i)
        # it is a radius
        r.append(i-STARTRADIUS)
        squares.append((i-STARTRADIUS)**2)
        sum = sum + (i-STARTRADIUS)**2

sum1 =0
sum0 =0

for i in final_data:
    print(i)
    if "1" in i:
        sum1 +=1
    else:
        sum0 +=1
    print(final_data[i])
    print()

print(len(final_data))
print("Class 0: " + str(sum0))
print("Class 1: " + str(sum1))

# some people change their strats mid way thru so cant just take a blind average.
# if data is clustered enough, can take average
# otherwise, just take first

# just take first
print("FEEDBACK 1 PERCENTAGE")

for i in final_data:
    if "1" in i:
        print(str(final_data[i][0][0]) +", "+str(final_data[i][0][1]))

print()
print("FEEDBACK 0 COLOUR")

for i in final_data:
    if "0" in i:
        print(str(final_data[i][0][0]) +", "+str(final_data[i][0][1]))


#print(data)
# print(x)
# print(y)
# plt.plot(x, y)
# plt.title('Data Plot')
# plt.ylabel('y')
# plt.xlabel('x')
# plt.grid()
# plt.xlim(-400, 400)
# plt.ylim(-400, 400)
# plt.show()
# file.close()
