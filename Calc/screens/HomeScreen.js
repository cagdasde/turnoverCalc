import { View, Text} from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";    


export default function HomeScreen() {
    const navigation = useNavigation();
    return (
            <View className="flex-1 bg-neutral-800">
                <Text>Home Screen</Text>
      
            </View>
    );
}