// algos support module
// helpers
const cl = (str) => {
  console.log(str);
};

const clj = (obj) => {
  console.log(JSON.parse(JSON.stringify(obj)));
};


function algoInfo() {
  cl('[algos] Hello!');
};
// use export built in to export interface - shortcut for module.export
exports.algoInfo = algoInfo;

cl('FROM MODULE: algos_sftest');


// Dijkstra
// we need
// Prioriy Q (min Heap)
// Graph
// Node - be able to sort

// noddy PriorityQ - lets get it working!
// lots of bad, implement as as fixed size minHeap
class PriorityQ {
  constructor(sortFunc, maxSize=200){
    this.q = [];
    this.sortFunc = sortFunc;
  }  
  push(o){
    this.q.push(o);
    this.q.sort(this.sortFunc);
  }  
  peek(){
    return(this.q[0]);
  }  
  pop(){
    return(this.q.shift());
  }  
  clear(){
    this.q = [];
  }  
  length(){
    return (this.q.length);
  }  
  isEmpty(){
    return ( this.q.length === 0 )
  }
  
}



// start simple
class RouteNode{
  constructor(x,y,owner=undefined) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.adj = [];
    this.pi = undefined;   // predecessor node - for route search
    this.distFromStartNode = Infinity;
  }
  
  updatePos(x,y){
    this.x = x;
    this.y = y;
  }

  clearAdjacencyList(){
    this.adj = [];
  }
  
  distanceFrom(node){
    let dx = Math.abs(this.x-node.x);
    let dy = Math.abs(this.y-node.y);
    return( Math.floor(Math.sqrt((dx*dx)+(dy*dy))) );    
  }
  
  static compAsc(nodeA, nodeB){
    return (nodeA.distFromStartNode - nodeB.distFromStartNode);
  }
  //static compDec(nodeB,nodeA){
  //  return (nodeA.distFromStartNode - nodeB.distFromStartNode);
  //}
  
  prt(){ // dbg out
    cl(`RouteNode: X:${this.x} Y:${this.y} SDist:${this.distFromStartNode}`);
  }
}
exports.RouteNode = RouteNode;

// at the moment this is really just managing the adjacency lists in the nodes
class Graph{
  constructor(){
    this.allNodes = [];
  }

  addEdge(u, v, distance=undefined){     // TODO - change name to undirected edge
    if (!(this.allNodes.includes(u))) {
      this.allNodes.push(u);
    }
    if (!(this.allNodes.includes(v))) {
      this.allNodes.push(v);
    }

    if (!distance) distance = u.distanceFrom(v);

    u.adj.push([v, distance]);
    v.adj.push([u, distance]);
  }

  neighbours(node){
    return node.adj;
  }
  
  //resetAllNodesToInfinity(){
  //  //for (let node in this.allNodes) {     // TODO - look into linter comment
  //  //  node.distFromStartNode = Infinity;
  //  //}
  //  for (let i=0; i<this.allNodes.length; i++) {
  //    this.allNodes[node].distFromStartNode = Infinity;
  //  }    
  //}
  
  prt(){
    cl('Graph - dbg print:   - - S');
    cl(this.allNodes);
    cl('Graph - dbg print:   - - E');
  }
}
exports.Graph = Graph;

// S - Start node
// T - Target node
function dijkstra(S, T, gDbg=null) {
  let path = [];
  let visited = new Set();
  let q = new PriorityQ(RouteNode.compAsc);
  S.distFromStartNode = 0;      
  q.push(S);
  visited.add(S);
  
  let noRoute = false;
  while (!(visited.has(T))) {
    let qNode = q.pop();
    try {
      for (const n of qNode.adj) {
        let distQAdjacent; let adjNode; let pathWeight;
        [adjNode, distQAdjacent] = n;    // n = [node, distance]
        pathWeight = qNode.distFromStartNode + distQAdjacent;
        
        // relax - update adjNode with new path
        if (pathWeight < adjNode.distFromStartNode) { 
          adjNode.distFromStartNode = pathWeight;
          adjNode.pi = qNode;
          q.push(adjNode);
        }      
        visited.add(adjNode); 
      }      
    } catch(e) {        //cl(e);
      noRoute = true;
      break;
    }
  }
   
  if (!noRoute) {
    path.push(T);     // got T - reconstruct path
    
    let parent = T.pi;
    while (!(path.includes(S))) {
      path.push(parent);
      parent = parent.pi;
    }
  } 
  
  //cl(`djtr rt len:${path.length}`);
  return(path);
}
exports.dijkstra = dijkstra;












cl('FROM MODULE: algos_sftest - Tests - - - - - - S');
// MAKE INTO more thorough unit tests - TODO
cl('> - - RouteNode - - -');
//let n = [];
//for (let i=0; i<10; i++) {
//  let node = new RouteNode(1,2);
//  node.distFromStartNode = Math.floor(Math.random()*100);
//  node.prt();
//  n.push(node);
//}
//
//cl('Node list - sort ascending');
//cl(n.sort(RouteNode.compAsc));
//cl('Sorted Node list');
//cl(n.sort(RouteNode.compDec));

cl('> - - PriortyQ - - -');
//let q = new PriorityQ(RouteNode.compAsc);
//for (let i=1; i<5; i++) {
//  let node = new RouteNode(1,2);
//  node.distFromStartNode = i;
//  q.push(node);
//}
//
//while (!q.isEmpty()) {
//  clj(q.pop());
//}

cl('> - - Graph - - -');
//let points = [[0,0],[0,10],[10,10],[10,0]];
//let nodes = [];
//for (let xy in points) {
//  let x; let y;
//  [x, y] = points[xy];
//  nodes.push(new RouteNode(x,y));
//}
//
//let g = new Graph();
//g.addEdge(nodes[0],nodes[1]);
//g.addEdge(nodes[1],nodes[2]);
//g.addEdge(nodes[2],nodes[3]);
//g.addEdge(nodes[3],nodes[0]);
//g.addEdge(nodes[0],nodes[2]);
//g.addEdge(nodes[1],nodes[3]);
//g.prt();
//
//let t = {};
//t[nodes[0]]= [];    // CANNOT USE AN OBJECT AS A KEY in an Object - for (dict for (EG
//t[nodes[1]]= [];    // has to be a string - IE needs unique obj string for (dict
//t[nodes[2]]= [];
//t[nodes[3]]= [];
//cl('added object array');
//cl(t);
//t[nodes[0]].push(nodes[1]);
//t[nodes[1]].push(nodes[2]);
//t[nodes[2]].push(nodes[3]);
//t[nodes[3]].push(nodes[4]);
//cl('added edges');
//cl(t);
//for (const n of t[nodes[0]]) {
//  cl(n);
//}

cl('FROM MODULE: algos_sftest - Test - - - - - - E');


