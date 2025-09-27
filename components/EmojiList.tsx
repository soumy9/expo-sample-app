import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, ImageSourcePropType, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    onSelect: (item: ImageSourcePropType) => void;
    onCloseModal: () => void;
}

export default function EmojiList({ onSelect, onCloseModal }: Props) {
    const [emoji] = useState<ImageSourcePropType[]>([
        require('@/assets/images/emoji1.png'),
        require('@/assets/images/emoji2.png'),
        require('@/assets/images/emoji3.png'),
        require('@/assets/images/emoji4.png'),
        require('@/assets/images/emoji5.png'),
    ]);

    return (<FlatList
        horizontal showsHorizontalScrollIndicator={Platform.OS === "web"} data={emoji} 
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => {
            return (<View>
                <Pressable onPress={() => {
                    onSelect(item);
                    onCloseModal();
                }}>
                    <Image source={item} key={index} style={styles.image} />
                </Pressable>
            </View>)
        }}></FlatList>)
}


const styles = StyleSheet.create({
    listContainer: {
        flexDirection: "row"
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 20
    }
});