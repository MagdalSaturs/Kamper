USE master
GO

DROP DATABASE IF EXISTS Kamper
GO

CREATE DATABASE Kamper
GO

USE Kamper
GO

IF NOT EXISTS (SELECT name  
     FROM master.sys.server_principals
     WHERE name = 'app')
BEGIN
    CREATE LOGIN app WITH PASSWORD = 'app', CHECK_POLICY = OFF
END
GO

CREATE USER app FOR LOGIN app
GO

EXEC sp_addrolemember 'db_datawriter', 'app'
EXEC sp_addrolemember 'db_datareader', 'app'

GO

CREATE TABLE Uzytkownik (
	Id INT NOT NULL IDENTITY PRIMARY KEY,
	Admin VARCHAR(30) CHECK(Admin IN('TAK', 'NIE')) NOT NULL DEFAULT('NIE'),
    Imie VARCHAR(25) NOT NULL,
    Nazwisko VARCHAR(25) NOT NULL,
    Login VARCHAR(25) NOT NULL UNIQUE,
    Haslo VARCHAR(25) NOT NULL,
    Email VARCHAR(25) NOT NULL UNIQUE
)

INSERT INTO Uzytkownik
VALUES
('TAK', 'Magdalena', 'Saturska', 'magnolia1de', 'magnoliamagnolia', 'saturmag@gmail.com')

CREATE TABLE Wpis (
	Id INT NOT NULL IDENTITY UNIQUE,
	Uzytkownik INT FOREIGN KEY REFERENCES Uzytkownik(Id),
	Miejsce VARCHAR(50) NOT NULL,
	Miasto VARCHAR(50) NOT NULL,
	Opis VARCHAR(1000) NOT NULL CHECK(LEN(Opis) >= 20),
	Koordynaty VARCHAR(50) NOT NULL,
	KrajPochodzenia VARCHAR(30) NOT NULL CHECK(LEN(KrajPochodzenia) >= 3),
    Kategoria VARCHAR(15) CHECK(Kategoria IN('Nocleg', 'Zwiedzanie','Miejsca Nietypowe', 'Zabawa', 'Relaks', 'Jedzenie')),
	DataDodania DATE NOT NULL DEFAULT(GETDATE()),
    LinkZdjecia VARCHAR(300) NOT NULL
)

INSERT INTO Wpis
VALUES
(1, 'Kopalnia soli w Kładowie', 'Kładowo', 'To najgłębsza trasa turystyczna w Europie oraz jedna z najgłębszych na świecie. Kopalnia Soli Kłodawa to jedyna kopalnia głębinowa. Kopalnia jest unikatowa, ponieważ wszystkie chodniki i kawerny zostały wycięte w litej soli.', '52.2406176,18.9221', 'Polska', 'Zwiedzanie', '2022-07-11', 'http://podziemia.pl/wp-content/uploads/2017/07/2012.03.23.-090a-scaled.jpg')

CREATE TABLE Ulubione (
	Id INT NOT NULL IDENTITY PRIMARY KEY,
	Nazwa VARCHAR(8) NOT NULL CHECK(Nazwa = 'ULUBIONE') DEFAULT('ULUBIONE'),
	UczytkownikId INT NOT NULL FOREIGN KEY REFERENCES Uzytkownik(Id)
)

CREATE TABLE WpisUlubione (
    WpisId INT FOREIGN KEY REFERENCES Wpis(Id),
    UlubioneId INT FOREIGN KEY REFERENCES Ulubione(Id)
)