
export default class ConfUtils {

    static splitClassesAndStrings<T>(clsesAndStrings: (string | T)[]): [T[], string[]] {
        return [
            (clsesAndStrings).filter((cls): cls is T => typeof cls !== "string"),
            (clsesAndStrings).filter((str): str is string => typeof str === "string"),
        ];
    }

}