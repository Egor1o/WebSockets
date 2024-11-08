import matplotlib.pyplot as plt
import csv
import os


folderName = os.path.abspath('../performance/websocket/results')
files = [f for f in os.listdir(folderName)]
print(files)
print(os.path.abspath('../performance/websocket/results'))

for f in files:
    x = []
    y = []
    first = 1
    print(f)
    with open(os.path.join(folderName, f), 'r') as csvfile:
        plots = csv.reader(csvfile, delimiter=',')
        for row in plots:
            if first == 1:
                first = 2
                continue
            print(row)
            x.append(row[0]) 
            y.append(float(row[1]))

    x_indices = range(len(x))

    plt.bar(x_indices, y, color='g', width=0.4, label="Time")

    plt.xlabel('Emit events')
    plt.ylabel('Time taken to receive (ms)')
    plt.title('WebSocket Event Times ({})'.format(f))
    plt.legend()

    plt.xticks(x_indices, '', rotation=45, ha='right')

    plt.tight_layout()
    plt.show()
