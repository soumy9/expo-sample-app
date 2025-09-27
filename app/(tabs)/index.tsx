import { View, StyleSheet, ImageSourcePropType, Platform } from 'react-native';
import ImageViewer from '@/components/ImageViewer';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {saveToLibraryAsync, usePermissions, } from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domToImage from 'dom-to-image';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [permissionResponse, requestPermission] = usePermissions();
  const [selectedImage, setSelectedImage] = useState<ImageSourcePropType>(PlaceholderImage);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<ImageSourcePropType>();
  const imageRef = useRef<View | Node>(null);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri as ImageSourcePropType);
      setShowAppOptions(true);
    } else {
      alert('please pick an image');
    }
  };

  const resetHandler = () => {
    setShowAppOptions(false);
  };

  const addHandler = () => {
    setIsVisible(true);
  };
  const saveHandler = async () => {
    try {
      const isWeb = Platform.OS === 'web';
      if(isWeb) {
         const dataUrl = await domToImage.toJpeg(imageRef.current as Node, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
        return;
      }
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef as RefObject<View | null>} collapsable={false}>
          <ImageViewer imgSource={selectedImage} />
          {selectedEmoji && <EmojiSticker imageSize={80} stickerSource={selectedEmoji} />}
        </View>
      </View>
      {showAppOptions ?
        (<>
          <View style={styles.actionButtonContainer}>
            <View style={styles.actionButtonRow}>
              <IconButton icon='refresh' label='Reset' onPress={resetHandler} />
              <CircleButton onPress={addHandler}></CircleButton>
              <IconButton icon='download' label='Save' onPress={saveHandler} />
            </View>
          </View>
          <EmojiPicker isVisible={isVisible} onClose={() => setIsVisible(false)}>
            <EmojiList onCloseModal={() => setIsVisible(false)} onSelect={(item) => { setSelectedEmoji(item) }} />
          </EmojiPicker>
        </>)
        :
        (<View>
          <Button label='Choose a photo' theme='primary' onPress={pickImageAsync} />
          <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
        </View>)
      }
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 80
  },
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
