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
  Platform,
  TextInput
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
  Briefcase,
  Home,
  Calculator,
  MapPin,
  Clock,
  Mail,
  Info
} from 'lucide-react-native';
import { supabase } from './src/lib/supabase';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('Home'); // Home, Calculator, Showroom
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Pieces');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [goldRate, setGoldRate] = useState({ gold22k: 7025, gold24k: 7665, silver: 91 });
  const [activeSlide, setActiveSlide] = useState(0);

  // Calculator State
  const [calcWeight, setCalcWeight] = useState('10');
  const [calcPurity, setCalcPurity] = useState('22K'); // 24K, 22K, 18K
  const [calcMaking, setCalcMaking] = useState('12'); // 12% making charges
  const [calcResult, setCalcResult] = useState({ metal: 0, making: 0, gst: 0, total: 0 });

  const categories = ['All Pieces', 'Gold Jewellery', 'Diamond Jewellery', 'Bullion', 'Bridal Collection'];

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    fetchGoldRates();
  }, []);

  useEffect(() => {
    calculateValuation();
  }, [calcWeight, calcPurity, calcMaking, goldRate]);

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
          gold22k: Math.round(json.rates.gold22k),
          gold24k: Math.round(json.rates.gold24k),
          silver: Math.round(json.rates.silver)
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

  // Luxury Valuation Logic
  const calculateValuation = () => {
    const weight = parseFloat(calcWeight) || 0;
    let ratePerGram = goldRate.gold22k;
    
    if (calcPurity === '24K') ratePerGram = goldRate.gold24k;
    if (calcPurity === '18K') ratePerGram = Math.round(goldRate.gold24k * 0.75); // 18K is 75% pure gold

    const metalVal = weight * ratePerGram;
    const makingPercent = parseFloat(calcMaking) || 0;
    const makingVal = metalVal * (makingPercent / 100);
    const subtotal = metalVal + makingVal;
    const gstVal = subtotal * 0.03; // Standard 3% Gold GST in India
    const finalTotal = subtotal + gstVal;

    setCalcResult({
      metal: Math.round(metalVal),
      making: Math.round(makingVal),
      gst: Math.round(gstVal),
      total: Math.round(finalTotal)
    });
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

  const openWhatsAppCalculator = () => {
    const message = `Hello MKS Jewellers, I generated a custom estimate using your app's live calculator: \n\n*Weight:* ${calcWeight} grams\n*Gold Purity:* ${calcPurity}\n*Making Charges:* ${calcMaking}%\n*Metal Value:* ₹ ${calcResult.metal.toLocaleString('en-IN')}\n*Estimated Valuation (inc. 3% GST):* ₹ ${calcResult.total.toLocaleString('en-IN')}\n\nPlease let me know how I can customize a design with this estimate.`;
    const encodedMsg = encodeURIComponent(message);
    const url = `whatsapp://send?phone=919636287754&text=${encodedMsg}`;
    Linking.openURL(url);
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

      {/* Main Tab Render Switch */}
      {activeTab === 'Home' && (
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
                <Text style={styles.tickerValue}>₹{goldRate.gold24k.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.tickerItem}>
                <Text style={styles.tickerLabel}>Gold 22K</Text>
                <Text style={styles.tickerValue}>₹{goldRate.gold22k.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.tickerItem}>
                <Text style={styles.tickerLabel}>Silver (1kg)</Text>
                <Text style={styles.tickerValue}>₹{(goldRate.silver * 1000).toLocaleString('en-IN')}</Text>
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
      )}

      {activeTab === 'Calculator' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.calcPage}>
            <View style={styles.calcHeader}>
              <Calculator size={22} color="#eebf63" />
              <Text style={styles.calcPageTitle}>GOLD VALUATION ENGINE</Text>
            </View>
            <Text style={styles.calcPageSubtitle}>Calculate instant transparent costings based on live wholesale commodity rates.</Text>

            {/* Input fields */}
            <View style={styles.calcForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ENTER GOLD WEIGHT (GRAMS)</Text>
                <TextInput
                  value={calcWeight}
                  onChangeText={setCalcWeight}
                  keyboardType="numeric"
                  placeholder="e.g. 10"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.inputBox}
                />
              </View>

              {/* Purity Selection Chips */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SELECT GOLD PURITY</Text>
                <View style={styles.purityRow}>
                  {['24K', '22K', '18K'].map((purity) => (
                    <TouchableOpacity
                      key={purity}
                      onPress={() => setCalcPurity(purity)}
                      style={[styles.purityChip, calcPurity === purity ? styles.activePurityChip : null]}
                    >
                      <Text style={[styles.purityText, calcPurity === purity ? styles.activePurityText : null]}>
                        {purity} ({purity === '24K' ? '99.9%' : purity === '22K' ? '91.6%' : '75.0%'})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Making Charges Slider mock input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MAKING CHARGES (%)</Text>
                <View style={styles.purityRow}>
                  {['8', '12', '15', '18'].map((percent) => (
                    <TouchableOpacity
                      key={percent}
                      onPress={() => setCalcMaking(percent)}
                      style={[styles.miniChip, calcMaking === percent ? styles.activeMiniChip : null]}
                    >
                      <Text style={[styles.miniChipText, calcMaking === percent ? styles.activeMiniChipText : null]}>
                        {percent}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Premium Gold Valuation Result Card */}
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Raw Gold Value</Text>
                <Text style={styles.resultValue}>₹ {calcResult.metal.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Making Charges ({calcMaking}%)</Text>
                <Text style={styles.resultValue}>+ ₹ {calcResult.making.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Govt. GST (3%)</Text>
                <Text style={styles.resultValue}>+ ₹ {calcResult.gst.toLocaleString('en-IN')}</Text>
              </View>
              
              <View style={styles.calcDivider} />
              
              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>TOTAL ESTIMATED VALUATION</Text>
                  <Text style={styles.taxDisclaimer}>*Excludes stone/gemstone charges</Text>
                </View>
                <Text style={styles.totalValue}>₹ {calcResult.total.toLocaleString('en-IN')}</Text>
              </View>

              <TouchableOpacity 
                onPress={openWhatsAppCalculator}
                style={styles.calcShareBtn}
              >
                <MessageSquare size={16} color="#110722" />
                <Text style={styles.calcShareBtnText}>SEND ESTIMATE TO STORE</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      )}

      {activeTab === 'Showroom' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.showroomPage}>
            
            <View style={styles.showroomHero}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop" }} 
                style={styles.showroomImg} 
              />
              <View style={styles.showroomOverlay} />
              <Text style={styles.showroomBrand}>MKS ATELIER</Text>
              <Text style={styles.showroomSub}>Where Gold Meets Grandeur</Text>
            </View>

            <View style={styles.showroomInfo}>
              <Text style={styles.showroomStoryTitle}>OUR HERITAGE STORY</Text>
              <Text style={styles.showroomStory}>
                Founded with a mission to revive authentic Rajputana craft and Nakshi artwork, MKS Jewellers represents the highest standard of purity, authenticity, and bespoke craftsmanship in standard gold, diamonds, and precious gemstones.
              </Text>

              {/* Showroom metadata cards */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MapPin size={18} color="#eebf63" />
                  <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>FLAGSHIP SHOWROOM</Text>
                    <Text style={styles.infoValue}>124, Gold Bazaar, Jaipur, Rajasthan, India</Text>
                  </View>
                </View>

                <View style={[styles.infoRow, styles.marginTopBorder]}>
                  <Clock size={18} color="#eebf63" />
                  <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>BUSINESS HOURS</Text>
                    <Text style={styles.infoValue}>Mon - Sun: 11:00 AM - 8:30 PM (IST)</Text>
                  </View>
                </View>

                <View style={[styles.infoRow, styles.marginTopBorder]}>
                  <Mail size={18} color="#eebf63" />
                  <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>OFFICIAL ENQUIRY EMAIL</Text>
                    <Text style={styles.infoValue}>enquire@mksjewellers.com</Text>
                  </View>
                </View>
              </View>

              {/* Call and WhatsApp Buttons */}
              <View style={styles.contactRow}>
                <TouchableOpacity 
                  onPress={callShowroom}
                  style={styles.contactBtn}
                >
                  <Phone size={16} color="#eebf63" />
                  <Text style={styles.contactBtnText}>CALL ATELIER</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => Linking.openURL('whatsapp://send?phone=919636287754&text=Hello%20MKS%20Jewellers')}
                  style={[styles.contactBtn, styles.contactBtnGold]}
                >
                  <MessageSquare size={16} color="#110722" />
                  <Text style={[styles.contactBtnText, styles.contactBtnTextDark]}>WHATSAPP ENQUIRY</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </ScrollView>
      )}

      {/* State-Driven Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setActiveTab('Home')}
          style={[styles.tabItem, activeTab === 'Home' ? styles.activeTabItem : null]}
        >
          <Home size={18} color={activeTab === 'Home' ? '#eebf63' : '#9a8fae'} />
          <Text style={[styles.tabLabel, activeTab === 'Home' ? styles.activeTabLabel : null]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('Calculator')}
          style={[styles.tabItem, activeTab === 'Calculator' ? styles.activeTabItem : null]}
        >
          <Calculator size={18} color={activeTab === 'Calculator' ? '#eebf63' : '#9a8fae'} />
          <Text style={[styles.tabLabel, activeTab === 'Calculator' ? styles.activeTabLabel : null]}>Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('Showroom')}
          style={[styles.tabItem, activeTab === 'Showroom' ? styles.activeTabItem : null]}
        >
          <Info size={18} color={activeTab === 'Showroom' ? '#eebf63' : '#9a8fae'} />
          <Text style={[styles.tabLabel, activeTab === 'Showroom' ? styles.activeTabLabel : null]}>Showroom</Text>
        </TouchableOpacity>
      </View>

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
    justifyContent: 'space-between',
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
    paddingBottom: 110, // Added padding to avoid tab bar overlap
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
  
  /* Calculator Tab Styling */
  calcPage: {
    padding: 20,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  calcPageTitle: {
    color: '#eebf63',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  calcPageSubtitle: {
    color: '#9a8fae',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 24,
  },
  calcForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.1)',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#eebf63',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(238,191,99,0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purityRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  purityChip: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(238,191,99,0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activePurityChip: {
    backgroundColor: '#eebf63',
    borderColor: '#eebf63',
  },
  purityText: {
    color: '#9a8fae',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activePurityText: {
    color: '#110722',
  },
  miniChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(238,191,99,0.1)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeMiniChip: {
    backgroundColor: '#eebf63',
    borderColor: '#eebf63',
  },
  miniChipText: {
    color: '#9a8fae',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeMiniChipText: {
    color: '#110722',
  },
  resultCard: {
    backgroundColor: 'rgba(238,191,99,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(238,191,99,0.3)',
    borderRadius: 20,
    padding: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultLabel: {
    color: '#d1c9df',
    fontSize: 12,
  },
  resultValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  calcDivider: {
    height: 1,
    backgroundColor: 'rgba(238, 191, 99, 0.2)',
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: '#eebf63',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  taxDisclaimer: {
    color: '#9a8fae',
    fontSize: 8,
    marginTop: 2,
  },
  totalValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Playfair Display' : 'serif',
  },
  calcShareBtn: {
    backgroundColor: '#eebf63',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  calcShareBtnText: {
    color: '#110722',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  /* Showroom page styling */
  showroomPage: {
    flex: 1,
  },
  showroomHero: {
    width: '100%',
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showroomImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  showroomOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(17,7,34,0.75)',
  },
  showroomBrand: {
    color: '#eebf63',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  showroomSub: {
    color: '#fff',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
    fontWeight: 'light',
  },
  showroomInfo: {
    padding: 24,
  },
  showroomStoryTitle: {
    color: '#eebf63',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  showroomStory: {
    color: '#d1c9df',
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: 'light',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(238,191,99,0.1)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  marginTopBorder: {
    borderTopWidth: 0.5,
    borderColor: 'rgba(238,191,99,0.1)',
    paddingTop: 16,
    marginTop: 8,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    color: '#eebf63',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eebf63',
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnGold: {
    backgroundColor: '#eebf63',
  },
  contactBtnText: {
    color: '#eebf63',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  contactBtnTextDark: {
    color: '#110722',
  },

  /* Tab Bar navigation */
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 7, 34, 0.96)',
    borderTopWidth: 1,
    borderColor: 'rgba(238, 191, 99, 0.15)',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    opacity: 0.6,
  },
  activeTabItem: {
    opacity: 1,
  },
  tabLabel: {
    color: '#9a8fae',
    fontSize: 9,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    color: '#eebf63',
    fontWeight: 'bold',
  },

  /* Modal styling */
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
