#Analisador Sintático 

## Feito com HTML, CSS e Jquery

S :: = aAb | bB
A :: = aSa | ε
B :: = bC  | cAc
C :: = aCc | ε


FIRST                 

S = {a, b}          
A = {a, ε}          
B = {c, b}          
C = {a, ε}          

FOLLOW

S = {$, a}
A = {b, c}
B = {$}
C = {c, $}

TABELA

     a          b        c       $
_________________________________________
S| S -> aAb | S -> bB |         |        |
A| A -> aSa | A -> ε  | A -> ε  |        |
B|          | B-> bC  | B-> cAc |        | 
C| C-> aCc  |         | C -> ε  | C -> ε |
_________________________________________

Entradas aceitas
bcaaaaabccababac aceito em 27 it
bbaaaccc aceito em 15 it
aaabab aceito em 11 it
bbac aceito em 9 it

Entradas com erro
aaabbab erro em 9 it
aabbcab erro em 10 it
