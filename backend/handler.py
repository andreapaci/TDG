import random

import backend.util as util
import backend.ampl_handler as ampl_handler


# Gioco con strategia pura
def gioco_puro(matrice, strat1_name, strat2_name):
    print(matrice)

    cons = strat_conservative_pure(matrice, strat1_name, strat2_name)

    # Player 1
    dom1 = strat_dominanti(matrice, 1, strat1_name)

    # Player 2
    dom2 = strat_dominanti(util.traspose(util.neg_matrix(matrice)), 2, strat2_name)

    return {"strat_dom1": dom1, "strat_dom2": dom2, "strat_cons1": cons["strat1"],
            "strat_cons2": cons["strat2"], "C1": cons["C1"], "C2": cons["C2"]}


def strat_dominanti(matrice, player, strat_name):

    best_response = []



    for strat_player2 in range(0, len(matrice[0])):
        best_response.append([])
        costo = min(util.column(matrice, strat_player2))
        for strat_player1 in range(0, len(util.column(matrice, strat_player2))):
            if util.column(matrice, strat_player2)[strat_player1] == costo:
                best_response[strat_player2].append(strat_name[strat_player1])

    strat_dom = best_response[0]
    for strat in best_response:
        strat_dom = util.intersection(strat_dom, strat)

    print("Le strategie dominanti per il player " + str(player) + " sono: " + str(strat_dom))

    return strat_dom


def strat_conservative_pure(matrice, strat1_name, strat2_name):


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
            strat_cons_1.append(strat1_name[i])
    for i in range(0, n_2):
        if C_segnato_2[i] == costo_cons_2:
            strat_cons_2.append(strat2_name[i])

    print("Staretegie conservative player 1: ", strat_cons_1, " con un costo di ", costo_cons_1)
    print("Staretegie conservative player 2: ", strat_cons_2, " con un costo di ", costo_cons_2)
    if costo_cons_1 == -costo_cons_2:
        print("Il valore del gioco è " + str(costo_cons_1))
    else:
        print(
            "Il gioco non ammette valore")  ## SICURI? CONTROLLA CHE SE NON ESISTONO STRATEGIE CONSERVATIVE IL GIOCO NON CRASHA

    return {"strat1": strat_cons_1, "strat2": strat_cons_2, "C1": costo_cons_1, "C2": costo_cons_2}



# Gioco con strategia mista
def gioco_misto(matrice, strat1_name, strat2_name):

    player1 = strat_conservative_miste(matrice)

    matrice_player2 = util.neg_matrix(util.traspose(matrice))

    player2 = strat_conservative_miste(matrice_player2)

    # AGGIUNGI VALORE DEL GIOCO MISTO, VERIFICA CHE SE VALORE GIOCO MISTO = VALORE GIOCO PURO E AGGIUNGI IL VALORE ATTESO FACENDO IL PRODOTTO TRA VETTORE E MATRICE

    return {"player1": player1, "player2": player2}


def strat_conservative_miste(matrice):

    ##  CONTROLLA CHE AMPL PUò RITORRNARE PIù STRATEGIE CONSERVATIVE SE SONO 2 O PIù

    modello = ampl_handler.crea_modello_AMPL(matrice)

    print(modello)

    return ampl_handler.solve_model(modello, matrice)


# Fa una simulazione del gioco
def simulazione(matrice, strat1, strat2, n_iterazioni):
    costo = 0
    for i in range(0, n_iterazioni):
        choice_player1 = util.choose_strategy(strat1)
        choice_player2 = util.choose_strategy(strat2)

        costo += matrice[choice_player1][choice_player2]

    print(costo)


# Restituisce strategie dominanti, conservative e valore del gioco
def studio_analitico(matrice, strat1_name, strat2_name):
    # Gioco puro
    puro = gioco_puro(matrice, strat1_name, strat2_name)

    # Gioco misto
    misto = gioco_misto(matrice, strat1_name, strat2_name)

    return {"puro": puro, "misto": misto}


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

    strat_mista_2 = [3 / 5, 0, 0, 2 / 5]
    strat_mista_1 = [1 / 3, 1 / 3, 1 / 3]
    # simulazione(matrice2, strat_mista_1, strat_mista_2, 100000)
    studio_analitico(matrice1, [1,2,3,4,5], [1,2,3])
