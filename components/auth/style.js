import { StyleSheet } from "react-native";
import { colors } from "../Theme/Colors";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  logo: {
    alignItems: "center",
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: colors.borderColor,
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
    padding: 10,
    paddingTop: 10,
    backgroundColor: colors.graylight,
  },
  button: {
    height: 40,
    margin: 10,
    padding: 10,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: colors.primary,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  dontHaveAccount: {
    margin: 10,
    padding: 10,
    color: "graylight",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  donthaveAccountText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
  },
  signUpText: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
  logoContainer: {
     alignItems: "center",
      marginTop: 70
  },
  scrollView: {
    backgroundColor: '#DDDDDD'
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    margin: 10,
    textAlign: 'justify'
  },
  signUpButton: (isValid) => (+{
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
    backgroundColor: isValid ? "#0096F6" : "#9ACAF7",
  }),
});

export default styles;
