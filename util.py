# File conenente funzioni di utilità

# Restituisce la colonna i-esima dalla matrice (contando da 0)
import copy
import random


def column(matrix, i):
    return [row[i] for row in matrix]


def traspose(matrix):
    return [[matrix[j][i] for j in range(len(matrix))] for i in range(len(matrix[0]))]


# Restituisce la matrice dei payoff dal punto di vista del player 2
def neg_matrix(matrix):
    neg_matrix = copy.deepcopy(matrix)
    for i in range(0, len(matrix)):
        for j in range(0, len(matrix[i])):
            neg_matrix[i][j] *= -1

    return neg_matrix


# Controlla che la matrice sia corretta (n x n)
def check_matrix(matrix):
    n = len(matrix)
    for row in matrix:
        if len(row) != n:
            return False
    return True


# Controlla che il vettore delle strategie miste sia corretto:
#   - tutti i valori >= 0
#   - somma dei valori == 1
#   - numero elemnti strategia mista = numero strategie pure
def check_strategy(vect, n):
    sum = 0
    if len(vect) != n:
        return False
    for elem in vect:
        if elem < 0:
            return False
        sum += elem

    if sum != 1:
        return False

# Dato un vettore di strategie simula la scelta randomica pesata di una strategia e la ritorna
def choose_strategy(strat_list):

    strat = 0
    sum = 0
    rand = random.random()
    for e in strat_list:
        sum += e
        if rand < sum:
            return strat
        strat += 1

# Ritorna una lista data dall'interesezione delle due
def intersection(lst1, lst2):
    lst3 = [value for value in lst1 if value in lst2]
    return lst3


