# ✅ Production Deployment Checklist

## Pre-Deployment

### Code Cleanup
- [x] Remove all console.log statements (development only)
- [x] Remove commented code
- [x] Remove unused imports
- [x] Remove test files from production build
- [x] Update .gitignore for production

### Environment Configuration
- [ ] Set up MongoDB Atlas production database
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Configure production email service
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Update VITE_API_URL to production API

### Security
- [ ] Verify all passwords are hashed
- [ ] Ensure JWT tokens expire appropriately
- [ ] Configure CORS for production domain only
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Remove default admin credentials
- [ ] Enable rate limiting (optional)

### Testing
- [ ] Test user registration flow
- [ ] Test login with email OTP
- [ ] Test profile creation and editing
- [ ] Test location picker functionality
- [ ] Test admin dashboard access
- [ ] Test on mobile devices
- [ ] Test with slow network (3G)

## Deployment

### Frontend
- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Deploy to hosting platform (Vercel/Netlify)
- [ ] Configure environment variables
- [ ] Verify custom domain (if applicable)
- [ ] Enable HTTPS

### Backend
- [ ] Ensure all dependencies are in package.json
- [ ] Test backend locally with production env
- [ ] Deploy to hosting platform (Render/Railway)
- [ ] Configure all environment variables
- [ ] Verify MongoDB connection
- [ ] Test health endpoint: /health
- [ ] Enable HTTPS

### Database
- [ ] Create production MongoDB cluster
- [ ] Set up database user with appropriate permissions
- [ ] Configure network access (IP whitelist)
- [ ] Create indexes for performance
- [ ] Set up automated backups
- [ ] Test connection from backend

## Post-Deployment

### Verification
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] Database connection is stable
- [ ] Email OTP is being sent
- [ ] User can register and login
- [ ] Profile features work correctly
- [ ] Admin panel is accessible
- [ ] No CORS errors in browser console

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Monitor API response times
- [ ] Track database performance
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure alerts for downtime

### Performance
- [ ] Check Lighthouse score (aim for 90+)
- [ ] Verify page load time < 3 seconds
- [ ] Test API response time < 500ms
- [ ] Optimize images and assets
- [ ] Enable caching headers

### Documentation
- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create admin user guide
- [ ] Document environment variables
- [ ] Add troubleshooting guide

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review database performance monthly
- [ ] Update dependencies quarterly
- [ ] Backup database regularly
- [ ] Review security patches

### Scaling Considerations
- [ ] Monitor user growth
- [ ] Plan for database scaling
- [ ] Consider CDN for static assets
- [ ] Implement caching strategy
- [ ] Set up load balancing (if needed)

---

## Quick Commands

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm run preview
```

### Deploy Frontend (Vercel)
```bash
vercel --prod
```

### Check Backend Health
```bash
curl https://your-api-url.com/health
```

### Monitor Logs (Render)
```bash
# View in Render dashboard
```

---

**Last Updated:** January 2026
