var fmc = require("formality-core");
var {defs, infs} = fmc.core.parse(code);

var code = `
def init      : [dpt] (dup fold = (dpt #[arr] (dup arr = arr #&(arr,arr))) #[init] (fold init))
def update    : [dpt] (dup exec = (dpt #[cont] [path] [fn] (get &(path0,path1) = (cpy path) (get &(swap0,swap1) = (if {path0 % 2} &(&([x] x,[x] x),&([pair] (get &(a,b) = pair &(b,a)),[pair] (get &(a,b) = pair &(b,a))))) (cont {path1 / 2} [arr] (get &(a,b) = (swap0 arr) (get &(b,x) = (fn b) &((swap1 &(a,b)),x))))))) #[path] [f] [arr] (fst (exec [path] [fn] fn path [x] &((f x),0) arr)))
def write     : [dpt] (dup exec = (dpt #[cont] [path] [fn] (get &(path0,path1) = (cpy path) (get &(swap0,swap1) = (if {path0 % 2} &(&([x] x,[x] x),&([pair] (get &(a,b) = pair &(b,a)),[pair] (get &(a,b) = pair &(b,a))))) (cont {path1 / 2} [arr] (get &(a,b) = (swap0 arr) (get &(b,x) = (fn b) &((swap1 &(a,b)),x))))))) #[path] [val] [arr] (fst (exec [path] [fn] fn path [x] &(val,0) arr)))
def read      : [dpt] (dup exec = (dpt #[cont] [path] [fn] (get &(path0,path1) = (cpy path) (get &(swap0,swap1) = (if {path0 % 2} &(&([x] x,[x] x),&([pair] (get &(a,b) = pair &(b,a)),[pair] (get &(a,b) = pair &(b,a))))) (cont {path1 / 2} [arr] (get &(a,b) = (swap0 arr) (get &(b,x) = (fn b) &((swap1 &(a,b)),x))))))) #[path] [arr] (exec [path] [fn] fn path [x] (dup x = x &(#x,#x)) arr))
def boxed_add : [x] [y] (dup x = x (dup y = y #{x + y}))

def Cons: [head] [tail]
  [Cons] [Nil]
  (Cons head tail)

def Nil:
  [Cons] [Nil]
  Nil
  
def Wall:
  [Wall]
  Wall

def main:
  let dpt  = ~12
  dup init = (init dpt)

  # dup arr    = (init ##Nil)
    dup write  = (write dpt)
    dup update = (update dpt)
    dup read   = (read dpt)

  # let add = boxed_add
    let arr = (write 3 #(Cons Wall (Cons Wall Nil)) arr)
    let arr = (write 0 #(Cons Wall (Cons Wall Nil)) arr)
    arr
`;

const to_json = (term) => {
  function tree(tree) {
    var array = [];
    (function go(tree){
      if (typeof tree === "object") {
        go(tree[0]);
        go(tree[1]);
      } else {
        array.push(tree);
      }
    })(term);
    return array;
  }
  function list(term) {
    var array = [];
    (function go(list) {
      var aff = list(x => xs => {
        array.push(x);
        go(xs);
      })("aff");
    })(term);
    return array;
  }
  function unit(term) {
    return term("Wall");
  }
  return {map: tree(term).map(x => list(x).map(unit))};
};

