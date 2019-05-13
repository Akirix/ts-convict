
/**
 * Tell me its a config
 * @param constructor 
 */
export function Config(constructor: ()=>void) {
    console.log('The class annotation ran',constructor);
}