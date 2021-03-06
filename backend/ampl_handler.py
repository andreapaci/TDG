# Gestice le interazioni con AMPL creando e risolvendo il modello

import amplpy
import os



# Crea lo script di AMPL per il problema di programmazione lineare
#   per il primo ed il secondo giocatore
def create_AMPL_model(matrice):

    # Player 1
    model = ""

    # Grandezza del vettore delle possibili giocate
    n_scelte = len(matrice)
    char_number = ord('A')
    for i in range(0, n_scelte):
        model += "var " + chr(char_number) + ";\n"
        char_number += 1
    model += "var Z;\n"

    model += "\nminimize value: Z;\n"

    for i in range(0, len(matrice[0])):

        model += "subject to limit" + str(i) + ": Z >= "
        char_number = ord('A')
        for j in range(0, len(matrice)):
            model += " + (" + str(matrice[j][i]) + "*" + chr(char_number) + ")"
            char_number += 1
        model += ";\n"

    char_number = ord('A')
    model += "\nsubject to summatory:"

    for i in range(0, n_scelte):
        model += " + " + chr(char_number)
        char_number += 1

    model += "= 1;\n\n"

    char_number = ord('A')

    for i in range(0, n_scelte):
        model += "subject to bound" + str(i) + ": " + chr(char_number) + ">= 0;\n"
        char_number += 1

    return model


# Risoluzione del modello
def solve_model(model, matrice):

    # Grandezza del vettore delle possibili giocate
    n_scelte = len(matrice)
    char_number = ord('A')
    variables = []
    for i in range(0, n_scelte):
        variables.append(chr(char_number))
        char_number += 1

    path = "backend/tmp/model.mod"

    f = open(path, "w")
    f.write(model)
    f.close()

    #ampl = amplpy.AMPL(amplpy.Environment('C:\\Program Files\\ampl.mswin64'))
    #ampl.setOption('solver', 'C:\\Program Files\\ampl.mswin64\\minos')
    ampl = amplpy.AMPL(amplpy.Environment('/Users/andreapaci/Downloads/ampl.macos64'))
    ampl.setOption('solver', '/Users/andreapaci/Downloads/ampl.macos64/minos')
    ampl.read(path)
    ampl.solve()

    solution = []
    objective = round(ampl.getObjective("value").value(), 3)


    for var in variables:
        solution.append(round(ampl.getVariable(var).value(), 3))

    ampl.close()

    os.remove(path)

    return {"objective": objective, "strat": solution}

