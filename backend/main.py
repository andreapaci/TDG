import random

import constants
import util as util
import ampl_handler as ampl_handler


# Gioco con strategia pura
def gioco_puro(matrice):


    print(matrice)
    strat_conservative_pure(matrice)

    # Player 1
    strat_dominanti(matrice, 1)

    # Player 2
    strat_dominanti(util.traspose(util.neg_matrix(matrice)), 2)


# Gioco con strategia mista
def gioco_misto(matrice):
    strat_conservative_miste(matrice)

    matrice_player2 = util.neg_matrix(util.traspose(matrice))
    print("\n" + str(matrice).replace("], ", "], \n").replace("[", "").replace("]", "") + "\n")
    print(str(matrice_player2).replace("], ", "], \n").replace("[", "").replace("]", "") + "\n")

    strat_conservative_miste(matrice_player2)


    #AGGIUNGI VALORE DEL GIOCO MISTO, VERIFICA CHE SE VALORE GIOCO MISTO = VALORE GIOCO PURO E AGGIUNGI IL VALORE ATTESO FACENDO IL PRODOTTO TRA VETTORE E MATRICE


def strat_dominanti(matrice, player):

    best_response = []
    for strat_player2 in range(0, len(matrice[0])):
        best_response.append([])
        costo = min(util.column(matrice, strat_player2))
        for strat_player1 in range(0, len(util.column(matrice, strat_player2))):
            if util.column(matrice, strat_player2)[strat_player1] == costo:
                best_response[strat_player2].append(strat_player1)

    strat_dom = best_response[0]
    for strat in best_response:
        strat_dom = util.intersection(strat_dom, strat)

    print("Le strategie dominanti per il player " + str(player) + " sono: " + str(strat_dom))


def strat_conservative_pure(matrice):
    print('\n\n\nSTRAT CONSERVATIVE PURE\n-------------------------------\n\n')
    n_1 = len(matrice)
    n_2 = len(matrice[0])

    # Giocatore 1
    C_segnato_1 = []  # C_segnato_1 è la funzione Costo segnata (per il player 1), cioè quella che ritorna il massimo costo per una strategia

    for strategie in range(0, n_1):
        C_segnato_1.append(max(matrice[strategie]))

    print("C_segnato per tutte le strategie del player 1: ", C_segnato_1)

    # Giocatore 2
    C_segnato_2 = []

    for strategie in range(0, n_2):
        C_segnato_2.append(max(util.column(util.neg_matrix(matrice), strategie)))

    print("C_segnato per tutte le strategie del player 2: ", C_segnato_2)

    # Strategie conservative per player 1 e 2 (dichiarate come array perchè possono essere più di una)
    strat_cons_1 = []
    strat_cons_2 = []

    # Costo della strategia conservativa per player 1 e 2
    costo_cons_1 = min(C_segnato_1)
    costo_cons_2 = min(C_segnato_2)

    for i in range(0, n_1):
        if C_segnato_1[i] == costo_cons_1:
            strat_cons_1.append(i)
    for i in range(0, n_2):
        if C_segnato_2[i] == costo_cons_2:
            strat_cons_2.append(i)

    print("Staretegie conservative player 1: ", strat_cons_1, " con un costo di ", costo_cons_1)
    print("Staretegie conservative player 2: ", strat_cons_2, " con un costo di ", costo_cons_2)
    if costo_cons_1 == -costo_cons_2:
        print("Il valore del gioco è " + str(costo_cons_1))
    else:
        print(
            "Il gioco non ammette valore")  ## SICURI? CONTROLLA CHE SE NON ESISTONO STRATEGIE CONSERVATIVE IL GIOCO NON CRASHA


def strat_conservative_miste(matrice):
    print('1\n\n\nSTRAT CONSERVATIVE MISTE\n-------------------------------\n\n')

    ##  CONTROLLA CHE AMPL PUò RITORRNARE PIù STRATEGIE CONSERVATIVE SE SONO 2 O PIù

    modello = ampl_handler.crea_modello_AMPL(matrice)

    print(modello)

    ampl_handler.solve_model(modello, matrice)


# Fa una simulazione del gioco
def simulazione(matrice, strat1, strat2, n_iterazioni):
    costo = 0
    for i in range(0, n_iterazioni):
        choice_player1 = util.choose_strategy(strat1)
        choice_player2 = util.choose_strategy(strat2)

        costo += matrice[choice_player1][choice_player2]

    print(costo)


# Restituisce strategie dominanti, conservative e valore del gioco
def studio_analitico(matrice, strat_mista_1, strat_mista_2):
    # Gioco puro
    gioco_puro(matrice)

    # Gioco misto
    gioco_misto(matrice)


# USARE CHECK MATRIX E STRATEGY
if __name__ == '__main__':
    """
    matrice = [[-3,-2, 1],
               [1,1,1],
               [1,-4,1],
               [-3, 1, 1],
               [1,-2,-5]]
               """
    matrice1 = [[-3, -2, 1],
               [1, 1, 1],
               [1, -4, 1],
               [-3, 1, 1],
               [1, -2, -5]]
    matrice2 = [[5, -3],
                [-6, -9]]

    strat_mista_2 = [3/5, 0, 0,  2/5]
    strat_mista_1 = [1/3, 1/3, 1/3]
    #simulazione(matrice2, strat_mista_1, strat_mista_2, 100000)
    studio_analitico(matrice2, strat_mista_1, strat_mista_2)
