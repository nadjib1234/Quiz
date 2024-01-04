import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions,Animated,TouchableOpacity,Image,ScrollView } from 'react-native';
import data from './QuizData';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {COLORS} from './Theme';

export default function App() {
    const allQuestions = data;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(false);
    const [score, setScore] = useState(0)

    const [progress, setProgress] = useState(new Animated.Value(0));
    const [fadeAnim, setFadeAnim]  = useState(new Animated.Value(0));

    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%','100%']
    })

    const Stack = createNativeStackNavigator();

  const validateAnswer = (selectedOption, navigation) => {
    let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    if (selectedOption === correct_option) {
        setScore(score + 1);
    }
    handleNext(navigation);
};

const handleNext = (navigation) => {
    if (currentQuestionIndex === allQuestions.length - 1) {
        navigation.navigate('Result');
    } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
    }

    Animated.parallel([
        Animated.timing(progress, {
            toValue: currentQuestionIndex + 1,
            duration: 2000,
            useNativeDriver: false,
        }),
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1900,
                useNativeDriver: false,
            }),
        ]),
    ]).start(() => {
        // Use setProgress here to update the state of progress
        setProgress(new Animated.Value(currentQuestionIndex + 1));
        setAnsweredQuestions(true); // Set answeredQuestions to true after the animation completes
    });
};
      

    const restartQuiz = () => {
        setAnsweredQuestions(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        
    }

    const startQuiz = () => {
        // Animated.timing(fadeAnim,{
        //     toValue: 1,
        //     duration: 1000,
        //     useNativeDriver: false
        // }).start();
        Animated.sequence([
            Animated.timing(fadeAnim,{
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(fadeAnim,{
                toValue: 1,
                duration: 1900,
                useNativeDriver: false})
          ]).start();

        
        Animated.timing(progress, {
            toValue: currentQuestionIndex,
            duration: 2000,
            useNativeDriver: false,
        }).start();

    }


    const renderQuestion = () => {
        return (
            
            <View style={{
            }}>
                {/* Question Counter */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end'
                 
                }}>
                    <Text style={{color: COLORS.black, fontSize: 15, opacity: 0.6, marginRight: 2}}>{currentQuestionIndex+1}</Text>
                    <Text style={{color: COLORS.black, fontSize: 13, opacity: 0.6}}>/ {allQuestions.length}</Text>
                </View>
           
                {/* Question */}
                <Text style={{
                    color: COLORS.black,
                    fontSize: 18,
                    textAlign: 'center', 
                    
                }}>{allQuestions[currentQuestionIndex]?.question}</Text>
            </View>
            
        )
    }

    const renderProgressBar = () => {
        const fillWidth = progress.interpolate({
          inputRange: [0, allQuestions.length - 1],
          outputRange: ['0%', '100%'],
        });
      
        return (
          <View
            style={{
              width: '80%',
              height: 5,
              borderRadius: 5,
              backgroundColor: '#00000020',
              marginBottom: 10,
              overflow: 'hidden', // Clip overflowing content
            }}
          >
            <Animated.View
              style={[
                {
                  height: '100%',
                  borderRadius: 5,
                  backgroundColor: COLORS.accent + '90',
                },
                {
                  width: fillWidth,
                },
              ]}
            ></Animated.View>
          </View>
        );
      };
      
      
      const AboutPage = () => {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>
              About This App 🚀
            </Text>
            <Text style={{ fontSize: 18, color: COLORS.black, marginBottom: 20 }}>
              This quiz app was created by Kamel Nedjib to test your rank in DZ GROUPE developers
              GANG.
            </Text>
            <Text style={{ fontSize: 18, color: COLORS.black, marginBottom: 20 }}>
              Have fun and prove yourself!
            </Text>
          </View>
        );
      };

    const renderOptions = (navigation) => {
        return (
          <View style={{ marginTop: 100 }}>
            {allQuestions[currentQuestionIndex]?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => validateAnswer(option, navigation)}
                disabled={isOptionsDisabled}
                style={{
                  backgroundColor: COLORS.accent,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  paddingHorizontal: 30,
                  marginVertical: 10,
                  shadowColor: '#171717',
                  shadowOffset: { width: -3, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              >
                <Text style={{ fontSize: 15, color: COLORS.white, textAlign: 'center' }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      };
      

    const QuizPage = ({navigation}) => {

        return (
            <ScrollView style={styles.scrollView}>
            <View style={{
                     flex: 1,
                     paddingVertical: 20,
                     paddingHorizontal: 30,
                     backgroundColor: COLORS.background,
                     position:'relative',
                 }}>
                 
              <View style={{
                  marginTop: 50,
                    marginVertical: 10,
                    padding: 40,
                    borderTopRightRadius: 40,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    shadowColor: '#171717',
                    shadowOffset: {width: -6, height: 6},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}>

              {renderProgressBar() }
      

              {renderQuestion()}
              </View>
              {renderOptions(navigation)}

      
            </View>
            </ScrollView>
         )
     }


     const WelcomePage = ({ navigation }) => {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              style={{
                width: '100%',
                height: 400,
                resizeMode: 'contain',
              }}
              source={require('./assets/t.png')}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginVertical: 20,
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: COLORS.black,
                }}
              >
                Prove you are a worthy member !
              </Text>
            </View>
      
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* About button */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('About');
                }}
                style={{
                  backgroundColor: COLORS.black,
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                  borderRadius: 15,
                  margin: 10,
                }}
              >
                <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 20 }}>
                  About
                </Text>
              </TouchableOpacity>
      
              {/* Render the appropriate button based on answeredQuestions */}
              {answeredQuestions ? (
                // Continue Quiz button
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Home');
                    startQuiz();
                  }}
                  style={{
                    backgroundColor: COLORS.black,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    borderRadius: 15,
                    margin: 10,
                  }}
                >
                  <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 20 }}>
                    Continue Quiz
                  </Text>
                </TouchableOpacity>
              ) : (
                // Let's Begin button
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Home');
                    startQuiz();
                  }}
                  style={{
                    backgroundColor: COLORS.black,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    borderRadius: 15,
                    margin: 10,
                  }}
                >
                  <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 20 }}>
                    Let's Begin
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      };
      
    
     const getRemark = () => {
        const percentage = (score / allQuestions.length) * 100;
      
        if (percentage === 100) {
          return { text: "My maaaaaan", color: 'green' };
        } else if (percentage >= 70) {
          return { text: "Nice try", color: 'yellow' };
        } else if (percentage >= 40) {
          return { text: "Gotta do your homework", color: 'orange' };
        } else {
          return { text: "Are you even in the group?", color: 'red' };
        }
      };
      
      const ResultPage = ({ navigation }) => {
        const { text: remarkText, color: remarkColor } = getRemark();
      
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.background,
                width: '90%',
                borderRadius: 20,
                padding: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 30 }}>Your Score</Text>
      
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginVertical: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 100,
                    color: COLORS.black,
                    fontWeight: 'bold',
                  }}
                >
                  {score}
                </Text>
                <Text
                  style={{
                    fontSize: 100,
                    color: COLORS.black,
                    fontWeight: 'bold',
                  }}
                >
                  {' '}
                  / {allQuestions.length}
                </Text>
              </View>
              <Text style={{ fontSize: 20, color: remarkColor, marginBottom: 20 }}>
                {remarkText}
              </Text>
              {/* Retry Quiz button */}
              <TouchableOpacity
                onPress={() => {
                  restartQuiz();
                  navigation.navigate('Welcome');
                }}
                style={{
                  backgroundColor: COLORS.black,
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  width: '50%',
                  borderRadius: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: COLORS.white,
                    fontSize: 20,
                  }}
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      };

    return (
 
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
          <Stack.Screen
            name="Home"
            component={QuizPage}
            options={{
              title: 'Question',
              headerStyle: {
                backgroundColor: '#EDA276',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen name="Result" component={ResultPage} options={{ headerShown: false }} />
          <Stack.Screen
            name="About"
            component={AboutPage}
            options={{
              title: 'About',
              headerStyle: {
                backgroundColor: '#EDA276', // You can customize the color
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      
    );
  };
  
//   export default Quiz;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
        backgroundColor: '#F7EBE1',
      },
  });

  
