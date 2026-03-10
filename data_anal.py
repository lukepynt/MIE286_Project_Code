
import matplotlib.pyplot as plt

filename = "data.txt"

# CHANGE THIS TO THE PATH OF YOUR DATA FILE
file = open(filename, "r")
#file.write("Time: " + str(time.time()) + "\n")
data = file.read().splitlines()
x = []
y = []

for i in range(len(data)):
    data[i] = data[i].split(" ")
    if i != 0:
        data[i].pop(0)
    data[i][0] = float(data[i][0])
    data[i][1] = float(data[i][1])
    x.append(-data[i][0])
    y.append(data[i][1])

#print(data)
print(x)
print(y)
plt.plot(x, y)
plt.title('Data Plot')
plt.ylabel('y')
plt.xlabel('x')
plt.grid()
plt.xlim(-400, 400)
plt.ylim(-400, 400)
plt.show()
file.close()
