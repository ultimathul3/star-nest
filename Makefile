APP=app
LIBS=-lsfml-graphics -lsfml-window -lsfml-system

run:
	g++ -c main.cpp -o main.o
	g++ main.o -o $(APP) $(LIBS)
	./$(APP)