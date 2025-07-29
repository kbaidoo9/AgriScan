import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Menu, Divider } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';


export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
const [capturedPhoto, setCapturedPhoto] = useState(null);
const [status, setStatus] = useState('idle');
const [menuVisible, setMenuVisible] = useState(false);
const menuAnchorRef = useRef(null);
const { clearUser } = useUser()
const openMenu = () => setMenuVisible(true);
const closeMenu = () => setMenuVisible(false);
  const navigation = useNavigation();

const handleLogout = () => {
  closeMenu();
  alert("Logged out");
  clearUser();
  navigation.navigate("login")
};


const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri);
        setStatus('preview');
  
        setTimeout(() => {
          setStatus('processing');
  
          setTimeout(() => {
            setStatus('completed');
          }, 2000);
        }, 5000);
      } catch (e) {
        console.log("Failed to take picture:", e);
      }
    }
  };
  


  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
  {/* Other components... */}
  <View style={styles.menuContainer} ref={menuAnchorRef}>
  <Menu
    visible={menuVisible}
    onDismiss={closeMenu}
    anchor={
      <TouchableOpacity onPress={openMenu} style={styles.ellipsisIcon}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    }
  >
    <Menu.Item onPress={handleLogout} title="Logout" leadingIcon="logout" />
  </Menu>
</View>


  
  {status === 'idle' && (
        <View style={styles.overlay}>
          <View style={styles.focusScanner}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>
  )}


 
  {status === 'preview' && capturedPhoto && (
    <BlurView intensity={50} style={styles.overlay}>
      <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
    </BlurView>
  )}

  {status === 'processing' && (
    <BlurView intensity={50} style={styles.overla}>
      <View style={{width: 300,height:300,borderRadius:50, overflow:"hidden", backgroundColor: "white", display:'flex', alignItems:"center", justifyContent:"center", flexDirection:"row",gap:4}}>
        <Text style={styles.completedText}>Processing...</Text>
      </View>
    </BlurView>
  )}

  {status === 'completed' && (
    <BlurView intensity={50} style={styles.overla}>
      <View style={{width: 300,height:300,borderRadius:50, overflow:"hidden", backgroundColor: "white", display:'flex', alignItems:"center", justifyContent:"center", flexDirection:"row",gap:4}}>
        <Ionicons name="checkmark-circle" size={40} color="#21c64b" />
        <Text style={styles.completedText}>Completed</Text>
      </View>
    </BlurView>
  )}

<View style={styles.bottomPanel}>
          <View style={styles.scanButtonWrapper}>
            <TouchableOpacity disabled={Boolean(capturedPhoto)} onPress={takePicture} style={styles.scanButton}>
            <MaterialIcons name="qr-code-scanner" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.zoomText}>1x</Text>
          </View>
        </View> 
</CameraView>

    </View>
  );
}

const SCANNER_SIZE = 300;
const BRACKET_SIZE = 40;
const LINE_WIDTH =6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  scanInstructionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  scanInstructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusScanner: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderTopWidth: LINE_WIDTH,
    borderLeftWidth: LINE_WIDTH,
    borderColor: 'white',
    borderTopLeftRadius: 30,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderTopWidth: LINE_WIDTH,
    borderRightWidth: LINE_WIDTH,
    borderColor: 'white',
    borderTopRightRadius: 30,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderBottomWidth: LINE_WIDTH,
    borderLeftWidth: LINE_WIDTH,
    borderColor: 'white',
    borderBottomLeftRadius: 30,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderBottomWidth: LINE_WIDTH,
    borderRightWidth: LINE_WIDTH,
    borderColor: 'white',
    borderBottomRightRadius: 30,
  },
  overla: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  processingBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
  },
  completedBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
scanButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#21c64b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scanIcon: {
    fontSize: 20,
    color: '#fff',
  },
  zoomText: {
    fontSize: 16,
    color: '#555',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 99,
  },
  
  ellipsisIcon: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
