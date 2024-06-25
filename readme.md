#Analisador Sintático 

## Feito com HTML, CSS e Jquery

S :: = aAb | bB
A :: = aSa | ε
B :: = bC  | cAc
C :: = aCc | ε


FIRST                 FOLLOW

S = {a, b}          S = {$, a}
A = {a, ε}          A = {b, c}
B = {c, b}          B = {$}
C = {a, ε}          C = {c, $}

TABELA

     a      |    b    |    c    |   $
_________________________________________
S| S -> aAb | S -> bB |         |        |
A| A -> aSa | A -> ε  | A -> ε  |        |
B|          | B-> bC  | B-> cAc |        | 
C| C-> aCc  |         | C -> ε  | C -> ε |
_________________________________________

bcaaaaabccababac aceito em 27 it
bbaaaccc aceito em 15 it
aaabab aceito em 11 it
bbac aceito em 9 it


aaabbab erro em 9 it
aabbcab erro em 10 it