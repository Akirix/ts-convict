
export default class ConfUtils {

    /**
     * Splits the classes and paths(strings) into two groups
     * @param clsesAndStrings 
     */
    public static splitClassesAndStrings<T>(clsesAndStrings: Array<(string | T)>): [T[], string[]] {
        return [
            (clsesAndStrings).filter((cls): cls is T => typeof cls !== "string"),
            (clsesAndStrings).filter((str): str is string => typeof str === "string"),
        ];
    }

}