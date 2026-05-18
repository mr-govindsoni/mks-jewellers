import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { 
  Gem, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ChevronRight, 
  Search, 
  ArrowUpRight,
  X,
  Compass,
  Briefcase
} from 'lucide-react-native';
import { supabase } from './src/lib/supabase';

const { width } = Dimensions.get('window');

export default function App() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Pieces');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [goldRate, setGoldRate] = useState({ gold22k: '7,025', gold24k: '7,665', silver: '91' });
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = ['All Pieces', 'Gold Jewellery', 'Diamond Jewellery', 'Bullion', 'Bridal Collection'];

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    fetchGoldRates();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from('hero_banners').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        setBanners(data);
      }
    } catch (err) {
      console.log('Error fetching banners:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (err) {
      console.log('Error fetching products:', err);
    }
  };

  const fetchGoldRates = async () => {
    try {
      const response = await fetch('https://chamunda-jewellers.vercel.app/api/get-rates');
      const json = await response.json();
      if (json.success && json.rates) {
        setGoldRate({
          gold22k: Math.round(json.rates.gold22k).toLocaleString('en-IN'),
          gold24k: Math.round(json.rates.gold24k).toLocaleString('en-IN'),
          silver: Math.round(json.rates.silver).toLocaleString('en-IN')
        });
      }
    } catch (err) {
      console.log('Using default luxury rates:', err);
    }
  };

  const filterCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'All Pieces') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  const openWhatsApp = (product) => {
    const message = `Hello MKS Jewellers, I am interested in viewing this piece: \n\n*Product:* ${product.title}\n*Collection:* ${product.collection || 'Luxury Collection'}\n*Price:* ${product.price || 'Contact for Price'}\n\nPlease share more details.`;
    const encodedMsg = encodeURIComponent(message);
    const url = `whatsapp://send?phone=919636287754&text=${encodedMsg}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          return Linking.openURL(`https://api.whatsapp.com/send?phone=919636287754&text=${encodedMsg}`);
        }
      })
      .catch((err) => console.log('Error opening WhatsApp', err));
  };

  const callShowroom = () => {
    Linking.openURL('tel:+919636287754');
  };

  const onScrollBanner = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#110722" />
      
      {/* 1. Header (Premium Brand Signature) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>MKS JEWELLERS</Text>
          <Text style={styles.brandSubtitle}>HERITAGE & FOREVER LUXURY</Text>
        </View>
        <View style={styles.liveContainer}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>LIVE RATES</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Realtime Gold Ticker Card */}
        <View style={styles.tickerCard}>
          <View style={styles.tickerHeader}>
            <Sparkles size={14} color="#eebf63" />
            <Text style={styles.tickerTitle}>TODAY'S BULLION RATE (per 10g)</Text>
          </View>
          <View style={styles.tickerGrid}>
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>Gold 24K</Text>
              <Text style={styles.tickerValue}>₹{goldRate.gold24k}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>Gold 22K</Text>
              <Text style={styles.tickerValue}>₹{goldRate.gold22k}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>Silver (1kg)</Text>
              <Text style={styles.tickerValue}>₹{goldRate.silver * 1000}</Text>
            </View>
          </View>
        </View>

        {/* 3. High-End Banner Slider (Paging Carousel) */}
        {banners.length > 0 && (
          <View style={styles.sliderWrapper}>
            <FlatList
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              onScroll={onScrollBanner}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image source={{ uri: item.desktop_image }} style={styles.slideImage} />
                  <View style={styles.slideOverlay} />
                  <View style={styles.slideContent}>
                    <View style={styles.slideBadge}>
                      <Text style={styles.slideBadgeText}>{item.luxury_tag || 'EXCLUSIVE'}</Text>
                    </View>
                    <Text style={styles.slideTitle}>{item.title}</Text>
                    <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.slideDesc} numberOfLines={2}>{item.description}</Text>
                  </View>
                </View>
              )}
            />
            {/* Carousel Dots Ticker */}
            <View style={styles.dotsContainer}>
              {banners.map((_, index) => (
                <View 
                  key={index} 
                  style={[styles.dot, activeSlide === index ? styles.activeDot : null]} 
                />
              ))}
            </View>
          </View>
        )}

        {/* 4. Luxury Category Filter Chips */}
        <View style={styles.sectionHeader}>
          <Compass size={16} color="#eebf63" />
          <Text style={styles.sectionTitle}>EXPLORE OUR COLLECTIONS</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => filterCategory(cat)}
              style={[
                styles.categoryChip, 
                selectedCategory === cat ? styles.activeCategoryChip : null
              ]}
            >
              <Text style={[
                styles.categoryChipText, 
                selectedCategory === cat ? styles.activeCategoryChipText : null
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5. Luxury Product Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => setSelectedProduct(product)}
            >
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              <View style={styles.productBadge}>
                <Text style={styles.productBadgeText}>{product.category}</Text>
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.productCollection} numberOfLines={1}>{product.collection || 'Signature Heritage'}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{product.price || 'Price on Enquiry'}</Text>
                  <ArrowUpRight size={14} color="#eebf63" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* 6. Breathtaking Product Detail Sheet Modal */}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedProduct}
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Close Bar */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedProduct(null)}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>

              <Image source={{ uri: selectedProduct.images[0] }} style={styles.modalImage} />
              
              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalPadding}>
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalCat}>{selectedProduct.category.toUpperCase()}</Text>
                    <View style={styles.modalTag}>
                      <Text style={styles.modalTagText}>Certified pure</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                  <Text style={styles.modalCollection}>{selectedProduct.collection || 'Signature Rajputana Heritage'}</Text>
                  
                  <Text style={styles.modalPrice}>{selectedProduct.price || 'Price on Request'}</Text>
                  
                  <Text style={styles.modalDescLabel}>DESCRIPTION & DETAILS</Text>
                  <Text style={styles.modalDesc}>{selectedProduct.description}</Text>

                  {selectedProduct.tags && (
                    <View style={styles.modalTagsContainer}>
                      {selectedProduct.tags.split(',').map((tag, idx) => (
                        <View key={idx} style={styles.modalMiniTag}>
                          <Text style={styles.modalMiniTagText}>#{tag.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Action Buttons footer */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  onPress={() => openWhatsApp(selectedProduct)}
                  style={styles.whatsappButton}
                >
                  <MessageSquare size={16} color="#110722" />
                  <Text style={styles.whatsappButtonText}>ENQUIRE ON WHATSAPP</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={callShowroom}
                  style={styles.callButton}
                >
                  <Phone size={16} color="#eebf63" />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#110722', // Deep Luxury Velvet background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(238, 191, 99, 0.1)',
  },
  brandTitle: {
    color: '#eebf63', // Elegant Gold accent
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  brandSubtitle: {
    color: '#9a8fae',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 2,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 191, 99, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.25)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80', // Active Green
    marginRight: 6,
  },
  liveText: {
    color: '#eebf63',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tickerCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.15)',
  },
  tickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  tickerTitle: {
    color: '#9a8fae',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  tickerGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tickerItem: {
    alignItems: 'center',
  },
  tickerLabel: {
    color: '#9a8fae',
    fontSize: 10,
    marginBottom: 4,
  },
  tickerValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Playfair Display' : 'serif',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(238, 191, 99, 0.1)',
  },
  sliderWrapper: {
    width: '100%',
    height: 280,
    position: 'relative',
    marginBottom: 20,
  },
  slide: {
    width: width,
    height: 280,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(17, 7, 34, 0.7)', // Premium overlay tint
  },
  slideContent: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  slideBadge: {
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
  },
  slideBadgeText: {
    color: '#eebf63',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  slideSubtitle: {
    color: '#eebf63',
    fontSize: 14,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  slideDesc: {
    color: '#d1c9df',
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    backgroundColor: '#eebf63',
    width: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#eebf63',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2.5,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.1)',
  },
  activeCategoryChip: {
    backgroundColor: '#eebf63',
    borderColor: '#eebf63',
  },
  categoryChipText: {
    color: '#9a8fae',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeCategoryChipText: {
    color: '#110722',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  productCard: {
    width: (width - 36) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.08)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17, 7, 34, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(238, 191, 99, 0.3)',
  },
  productBadgeText: {
    color: '#eebf63',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  productDetails: {
    padding: 12,
  },
  productTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  productCollection: {
    color: '#9a8fae',
    fontSize: 10,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    color: '#eebf63',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#110722',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '90%',
    position: 'relative',
    borderTopWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.2)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalImage: {
    width: '100%',
    height: '42%',
    resizeMode: 'cover',
  },
  modalScroll: {
    flex: 1,
  },
  modalPadding: {
    padding: 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalCat: {
    color: '#eebf63',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  modalTag: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  modalTagText: {
    color: '#4ade80',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  modalCollection: {
    color: '#9a8fae',
    fontSize: 12,
    marginTop: 4,
  },
  modalPrice: {
    color: '#eebf63',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Playfair Display' : 'serif',
  },
  modalDescLabel: {
    color: '#9a8fae',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(238,191,99,0.1)',
    paddingBottom: 4,
  },
  modalDesc: {
    color: '#d1c9df',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: 'light',
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  modalMiniTag: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 0.5,
    borderColor: 'rgba(238,191,99,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalMiniTagText: {
    color: '#9a8fae',
    fontSize: 10,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.1)',
    gap: 12,
    backgroundColor: 'rgba(17, 7, 34, 0.95)',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#eebf63',
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  whatsappButtonText: {
    color: '#110722',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eebf63',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
